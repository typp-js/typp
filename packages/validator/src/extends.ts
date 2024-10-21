import type {} from '@typp/validator/error'
import type {
  AtLeastOneProperty,
  IsConfigure,
  IsEqual,
  IsNotEqual,
  Narrow,
  Switch,
  t as tn,
  Typp
} from '@typp/core/base'

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {
    // TODO https://zod.dev/?id=coercion-for-primitives
    // export const coerce: typeof tn
    interface ValidateOptions {
      /**
       * Try to validate, wrap the result with `ValidateResult`
       */
      try?: boolean
      /**
       * Narrow input type and return the input value literally
       */
      const?: boolean
      /**
       * Input must exactly match the type
       */
      exact?: boolean
      /**
       * no transform and exact match
       */
      strict?: boolean
      /**
       * As much as possible transform input value to the type
       */
      transform?: boolean
    }
    interface Validator<Shape = unknown> {
      validate: Validate<Shape>
      /**
       * always called before `validate`, error will be caught and thrown as `ParseError`
       */
      preprocess: Transform<Shape>
      /**
       * only when `transform` is `true` and validate failed, this function will be called
       * error will be caught and thrown as `ParseError`
       */
      transform: Transform<Shape>
    }
    interface Match<Shape = unknown> {
      // TODO
      // @ts-ignore  error TS2589: Type instantiation is excessively deep and possibly infinite.
      (s: t.Schema<any, any>, input: unknown): s is t.Schema<Shape, any>
    }
    function useValidator<Shape>(
      shapesOrMatcher: Shape[] | Match<Shape>,
      validator: AtLeastOneProperty<Validator<Shape>>
    ): () => void
  }
  namespace t {
    export interface ValidateExtendsEntries<T> {
      [key: string]: [boolean, any]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      [key: string]: [boolean, any]
    }
    export interface ValidateSuccessResult<T> {
      success: true
      data: T
    }
    export interface ValidateErrorResult {
      success: false
      error: t.ValidateError
    }
    export type ValidateResult<T> = ValidateSuccessResult<T> | ValidateErrorResult
    export type ValidateReturnType<
      T,
      ExtendsT,
      Input,
      InputRest,
      Opts extends ValidateOptions
    > = [
      Opts['transform'], Omit<Opts, 'transform'>
    ] extends [
      true, infer Next extends ValidateOptions
    ] ? (
      Switch<ValidateTransformEntries<T, Input, InputRest>> extends infer TransformInput
        ? ValidateReturnType<T, ExtendsT, TransformInput, TransformInput, Next>
        : never
    ) : [
      Opts['try'], Omit<Opts, 'try'>
    ] extends [
      true, infer Next extends ValidateOptions
    ] ? (
      true extends (
        (
          | (
            & IsNotEqual<T, any>
            & IsEqual<InputRest, any>
          )
          | (
            & IsNotEqual<T, unknown>
            & IsEqual<InputRest, unknown>
          )
        )
        & IsNotEqual<Input, never>
      ) ? ValidateResult<ValidateReturnType<T, ExtendsT, Input, InputRest, Next>>
        : true extends (
          | ([Input] extends [ExtendsT] ? false : true)
          | (IsNotEqual<T, never> & IsEqual<Input, never>)
        ) ? ValidateErrorResult
          : ValidateSuccessResult<ValidateReturnType<T, ExtendsT, Input, InputRest, Next>>
    ) : [
      Opts['const'], Omit<Opts, 'const'>
    ] extends [
      true, infer Next extends ValidateOptions
    ] ? (
      ValidateReturnType<
        true extends (
          | ([Input] extends [T] ? true : false)
          | IsEqual<InputRest, unknown>
        ) ? Input : never,
        ExtendsT,
        Input, InputRest, Next
      >
    ) : (
      true extends (
        (
          | ([Input] extends [ExtendsT] ? true : false)
          | IsEqual<Input, unknown>
        )
        & IsNotEqual<Input, never>
      ) ? T : never
    )
    interface ValidateItf<
      Shape, T, O extends ValidateOptions = {},
      ExtendsT = Switch<ValidateExtendsEntries<T>>
    > {
      <
        TT extends ExtendsT,
        Rest extends true extends (
          | IsConfigure<O, 'try'>
          | IsConfigure<O, 'transform'>
          | IsConfigure<Opts, 'try'>
          | IsConfigure<Opts, 'transform'>
        ) ? unknown : never,
        const Input extends TT | Rest,
        Opts extends ValidateOptions = {}
      >(
        data: Input, options?: Opts
      ): ValidateReturnType<T, ExtendsT, typeof data, Exclude<typeof data, ExtendsT>, Opts & O>
      narrow<
        TT extends ExtendsT,
        Rest extends true extends(
          | (O['try'] extends true ? true : false)
          | (O['transform'] extends true ? true : false)
        ) ? unknown : never,
        D extends TT | Rest,
        Opts extends ValidateOptions
      >(
        data: Narrow<D>, options?: Opts
      ): ValidateReturnType<T, ExtendsT, D, Exclude<D, ExtendsT>, Opts & O & { const: true }>
    }
    interface SchemaFieldsAll<Shape, T> {
      validate: ValidateItf<Shape, T>
      tryValidate: ValidateItf<Shape, T, { try: true }>
      parse: ValidateItf<Shape, T, { transform: true }>
      tryParse: ValidateItf<Shape, T, { try: true, transform: true }>
      // for zod
      safeParse: this['tryParse']

      test: (data: unknown, options?: Omit<tn.ValidateOptions, 'try'>) => data is T
    }
  }
}

export type Transform<Shape = unknown> = (
  this: Typp<[Shape]>,
  input: unknown,
  options?: Omit<tn.ValidateOptions, 'transform'>
) => unknown
export type Validate<Shape = unknown> = (
  this: Typp<[Shape]>,
  input: unknown,
  options?: Omit<tn.ValidateOptions, 'transform'>
) => boolean
