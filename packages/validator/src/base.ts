import { catchAndWrapProxy } from '#internal/utils.ts'
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
import { ParseError as _ParseError, ValidateError as _ValidateError } from '@typp/validator/error'

// dprint-ignore
// TODO extensible ?
export const FALSY = [
  '',
  null, 'null', 'Null', 'NULL',
  undefined, 'undefined', 'Undefined', 'UNDEFINED',
  0, '0',
  0n, '0n',
  'false', 'no', 'off',
  'False', 'No', 'Off',
  'FALSE', 'NO', 'OFF'
  // TODO [], {}, NaN
] as unknown[]

// [§21.4.1.1 Time Values and Time Range]
// > A Number can exactly represent all integers from -9,007,199,254,740,992 to 9,007,199,254,740,992 (21.1.2.8 and 21.1.2.6).
// > A time value supports a slightly smaller range of -8,640,000,000,000,000 to 8,640,000,000,000,000 milliseconds.
// > This yields a supported time value range of exactly -100,000,000 days to 100,000,000 days relative to midnight
// > at the beginning of 1 January 1970 UTC.
// 100_000_000 * 24 * 60 * 60 * 1000
export const MAX_TIME = 8640000000000000

type Transform<Shape = unknown> = (
  this: Typp<[Shape]>,
  input: unknown,
  options?: Omit<tn.ValidateOptions, 'transform'>
) => unknown
type Validate<Shape = unknown> = (
  this: Typp<[Shape]>,
  input: unknown,
  options?: Omit<tn.ValidateOptions, 'transform'>
) => boolean

// TODO
// @ts-ignore error TS2589: Type instantiation is excessively deep and possibly infinite.
type Match<Shape = unknown> = (s: tn.Schema<any, any>, input: unknown) => s is tn.Schema<Shape, any>
const validatorMappingByMatcher = [] as [
  matcher: Match,
  validator: AtLeastOneProperty<tn.Validator>
][]
const validators = new Map<unknown, AtLeastOneProperty<tn.Validator>>()

function _useValidator<Shape>(
  shapesOrMatcher: Shape[] | Match<Shape>,
  validator: AtLeastOneProperty<tn.Validator<Shape>>
) {
  if (Array.isArray(shapesOrMatcher)) {
    for (const shape of shapesOrMatcher) {
      validators.set(shape, validator)
    }
    return () => {
      for (const shape of shapesOrMatcher) {
        validators.delete(shape)
      }
    }
  } else {
    validatorMappingByMatcher.push([shapesOrMatcher, validator])
    const index = validatorMappingByMatcher.length - 1
    return () => {
      validatorMappingByMatcher.splice(index, 1)
    }
  }
}

// 如果俩个类型之间不支持转化，应该抛出「校验错误」还是「转化错误」？
// 实际上来说，一个值不能作为某个类型使用，存在俩种情况
// - 这个值不能被转化为目标的类型
//   - `{ a: 1 }` 就是转化不到 `number` 的
//     `{ a: 1, b: 2 }` 是可以转化到 `{ a: number }` 的，只需要删除掉多余的部分就可以了
// - 这个值就是不匹配目标类型，哪怕转化了也是
//   - `1` 就是不匹配 `'2' | '3'` 的
//   - `{}` 并不在 `number` 的转化范围内，是一个无法被转化的值，这个时候应该抛出「校验错误」的异常，而不是「无法转化」的异常
function validate(this: tn.Schema<any, any>, data: any, options?: tn.ValidateOptions): any
function validate(this: tn.Schema<any, any>, ...args: any[]) {
  if (args.length === 0) {
    throw new Error('No data to validate')
  }
  const [data, options = {}] = args as [any, tn.ValidateOptions]
  const {
    try: isTry = false,
    const: isConst = false,
    exact: isExact = false,
    transform: isTransform = false
  } = options
  const wrap = () => {
    // TODO
    //  完全匹配
    //  部分匹配，部分缺失或不匹配: partially
    //  完全不匹配: unexpected
    //  完全匹配但超过了原类型: excessive
    let rt = data
    let validator: AtLeastOneProperty<tn.Validator> | undefined
    if (validators.has(this.shape)) {
      validator = validators.get(this.shape)
    } else {
      for (const [matcher, v] of validatorMappingByMatcher) {
        if (matcher(this, rt)) {
          validator = v
          break
        }
      }
    }
    if (!validator) {
      throw new Error(
        `Unable to validate when shape is \`${this.shape}\`, because the shape is not supported validator`
      )
    }

    const {
      preprocess: preprocessNoThis,
      validate: validateNoThis,
      transform: transformNoThis
    } = validator
    const [
      validate,
      transform,
      preprocess
    ] = [validateNoThis, transformNoThis, preprocessNoThis].map(fn => fn?.bind(this))
    if (!validate) {
      throw new Error(`Unable to validate when shape is ${this.shape}, because the shape is not supported validator`)
    }

    try {
      rt = preprocess ? preprocess(rt, options) : rt
    } catch (e) {
      if (e instanceof Error) {
        throw new _ParseError('preprocess', this, rt, e)
      }
      throw e
    }

    if (isTransform && !validate(rt, options)) {
      if (!transform) {
        throw new Error(
          `Unable to transform when shape is ${this.shape}, because the shape is not supported transformer`
        )
      }

      try {
        rt = transform(rt, options)
      } catch (e) {
        if (e instanceof Error) {
          throw new _ParseError('transform', this, rt, e)
        }
        throw e
      }
    }
    if (!validate(rt, options)) {
      throw new _ValidateError('unexpected', this, rt)
    }
    return rt
  }
  return isTry ? catchAndWrapProxy(wrap)() : wrap()
}
validate.narrow = validate
function validateGen(skm: tn.Schema<any, any>, defaultOptions?: tn.ValidateOptions) {
  function inner(...args: any[]) {
    if (args.length === 0) {
      throw new Error('No data to validate')
    }
    const [data, options] = args
    return validate.call(skm, data, {
      ...defaultOptions,
      ...options
    })
  }
  inner.narrow = (...args: unknown[]) => inner(...args)
  return inner
}

export function validatorSkeleton(t: typeof tn) {
  t.useStatic('useValidator', _useValidator)
  t.useStatic('ParseError', _ParseError)
  t.useStatic('ValidateError', _ValidateError)
  t.useFields({
    get validate() {
      return validateGen(this)
    },
    get tryValidate() {
      return validateGen(this, { try: true })
    },
    get parse() {
      return validateGen(this, { transform: true })
    },
    get tryParse() {
      return validateGen(this, { try: true, transform: true })
    }
  })
  t.useFields({
    test(data: unknown, options = {}): data is any {
      return validateGen(this, { ...options, try: true })(data, options).success
    }
  })
}

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {
    export const useValidator: typeof _useValidator
    export const ValidateError: typeof _ValidateError
    export type ValidateError = _ValidateError
    export const ParseError: typeof _ParseError
    export type ParseError = _ParseError
    export interface ValidateExtendsEntries<T> {
      [key: string]: [boolean, any]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      [key: string]: [boolean, any]
    }
    // TODO https://zod.dev/?id=coercion-for-primitives
    // export const coerce: typeof tn
    export interface ValidateOptions {
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
    export interface ValidateSuccessResult<T> {
      success: true
      data: T
    }
    export interface ValidateErrorResult {
      success: false
      error: _ValidateError
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
    interface Validator<Shape = unknown> {
      validate: Validate<Shape>
      /**
       * always called before `validate`, error will be catched and thrown as `ParseError`
       */
      preprocess: Transform<Shape>
      /**
       * only when `transform` is `true` and validate failed, this function will be called
       * error will be catched and thrown as `ParseError`
       */
      transform: Transform<Shape>
    }
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
