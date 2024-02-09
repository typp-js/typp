/* eslint-disable react-hooks/rules-of-hooks */
import type { AtLeastOneProperty, IsEqual, IsNotEqual, Narrow, Switch, t as tn, Typp } from '@typp/core'

import { FALSELY, MAX_TIME } from './base'
import {
  ParseError as _ParseError,
  ValidateError as _ValidateError
} from './base.inner'
import { typesValidator } from './types'
import { bigintValidator } from './types/primitive.bigint'
import { toPrimitive } from './utils'
import { catchAndWrapProxy } from './utils.inner'

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
type Match<Shape = unknown> = (s: tn.Schema<any, any>, input: unknown) => s is tn.Schema<Shape, any>
const resolverMappingByMatcher = [] as [
  matcher: Match, validator: AtLeastOneProperty<tn.Validator>
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
    resolverMappingByMatcher.push([shapesOrMatcher, validator])
    const index = resolverMappingByMatcher.length - 1
    return () => {
      resolverMappingByMatcher.splice(index, 1)
    }
  }
}

declare module '@typp/core' {
  namespace t {
    export const useValidator: typeof _useValidator
    export const ValidateError: typeof _ValidateError
    export const ParseError: typeof _ParseError
    export interface ValidateExtendsEntries<T> {
      [key: string]: [boolean, any]
      string: [
        [T] extends [string] ? true : false,
        string | String
      ]
      boolean: [
        [T] extends [boolean] ? true : false,
        boolean | Boolean
      ]
    }
    export interface ValidateTransformEntries<T, Input> {
      [key: string]: [boolean, any]
      string: [
        [T] extends [string] ? true : false,
        string
      ]
      boolean: [
        [T] extends [boolean] ? true : false,
        // TODO resolve literal type
        boolean
      ]
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
    export type ValidateSuccessResult<T> = {
      success: true
      data: T
    }
    export type ValidateErrorResult = {
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
      Switch<ValidateTransformEntries<T, InputRest>> extends infer TransformInput ? ValidateReturnType<
        T,
        ExtendsT,
        TransformInput,
        TransformInput,
        Next
      > : never
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
        Rest extends true extends(
          | (O['try'] extends true ? true : false)
          | (O['transform'] extends true ? true : false)
        ) ? unknown : never,
        Opts extends ValidateOptions
      >(
        data: ExtendsT | Rest,
        options?: Opts
      ): ValidateReturnType<T, ExtendsT, typeof data, Exclude<typeof data, ExtendsT>, Opts & O>
      narrow<
        TT extends ExtendsT,
        Rest extends true extends(
          | (O['try'] extends true ? true : false)
          | (O['transform'] extends true ? true : false)
        ) ? unknown : never,
        Opts extends ValidateOptions
      >(
        data: Narrow<TT | Rest>,
        options?: Opts
      ): ValidateReturnType<T, ExtendsT, typeof data, Exclude<typeof data, ExtendsT>, Opts & O & { const: true }>
    }
    interface SchemaFieldsAll<Shape, T> {
      validate: ValidateItf<Shape, T>
      tryValidate: ValidateItf<Shape, T, { try: true }>
      parse: ValidateItf<Shape, T, { transform: true }>
      tryParse: ValidateItf<Shape, T, { try: true, transform: true }>
      // for zod
      safeParse: this['tryParse']

      test: (data: unknown) => data is T
    }
  }
}
tn.useStatic('useValidator', _useValidator)
tn.useStatic('ParseError', _ParseError)
tn.useStatic('ValidateError', _ValidateError)

const preprocess: Transform = (input, options) => toPrimitive(input)

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
  if (args.length === 0)
    throw new Error('No data to validate')
  const [data, options = {}] = args as [any, tn.ValidateOptions]
  // TODO
  //  完全匹配
  //  部分匹配，部分缺失或不匹配: partially
  //  完全不匹配: unexpected
  //  完全匹配但超过了原类型: excessive
  let rt = data
  if (validators.has(this.shape)) {
    const {
      transform: isTransform = false
    } = options
    const {
      preprocess: preprocessNoThis,
      validate: validateNoThis,
      transform: transformNoThis
    } = validators.get(this.shape) ?? {}
    const [
      validate, transform, preprocess
    ] = [validateNoThis, transformNoThis, preprocessNoThis].map(fn => fn?.bind(this))
    if (!validate)
      throw new Error(`Unable to validate when shape is ${this.shape}, because the shape is not supported validator`)

    try {
      rt = preprocess ? preprocess(rt, options) : rt
    } catch (e) {
      if (e instanceof Error) {
        throw new _ParseError('preprocess', this, rt, e)
      }
      throw e
    }

    if (isTransform && !validate(rt, options)) {
      if (!transform)
        throw new Error(`Unable to transform when shape is ${this.shape}, because the shape is not supported transformer`)

      try {
        rt = transform(rt, options)
      } catch (e) {
        if (e instanceof Error) {
          throw new _ParseError('transform', this, rt, e)
        }
        throw e
      }
    }
    if (!validate(rt, options))
      throw new _ValidateError('unexpected', this, rt)
  }
  return rt
}
validate.narrow = validate
function parse(this: tn.Schema<any, any>, data: any, options?: tn.ValidateOptions): any
function parse(this: tn.Schema<any, any>, ...args: any[]) {
  if (args.length === 0)
    throw new Error('No data to validate')
  const [data, options] = args
  return validate.call(this, data, { transform: true, ...options })
}
parse.narrow = parse

export default function validator(t: typeof tn) {
  t.useFields({
    get validate() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const skm = this
      return new Proxy(validate, {
        get(target, key) {
          return (
            Reflect.get(target, key) as Function
          ).bind(skm)
        }
      })
    },
    get tryValidate() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const skm = this
      return catchAndWrapProxy(validate, {
        get(target, key) {
          return catchAndWrapProxy((
            Reflect.get(target, key) as Function
          ).bind(skm))
        }
      })
    },
    get parse() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const skm = this
      return new Proxy(parse, {
        get(target, key) {
          return (
            Reflect.get(target, key) as Function
          ).bind(skm)
        }
      })
    },
    get tryParse() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const skm = this
      return catchAndWrapProxy(parse, {
        get(target, key) {
          return catchAndWrapProxy((
            Reflect.get(target, key) as Function
          ).bind(skm))
        }
      })
    }
  })
  t.useFields({
    test(data: unknown): data is any {
      try {
        validate.call(this, data)
        return true
      } catch (e) {
        // TODO TYPE_SYMBOL
        if (e instanceof _ValidateError) {
          return false
        }
        throw e
      }
    }
  })

  t.use(typesValidator)
  t.use(bigintValidator)
  t.useValidator([String], {
    preprocess,
    validate: input => typeof input === 'string',
    transform: input => String(input)
  })
  t.useValidator([Boolean], {
    preprocess,
    validate: input => typeof input === 'boolean',
    transform: input => FALSELY.includes(input) ? false : Boolean(input)
  })
  t.useValidator([Symbol], {
    preprocess,
    validate: input => typeof input === 'symbol',
    transform: input => Symbol(String(input))
  })

  // TODO literal
  t.useValidator([null], {
    preprocess,
    validate: input => input === null,
    transform: input => FALSELY.includes(input) ? null : input
  })
  t.useValidator([undefined], {
    preprocess,
    validate: input => input === undefined,
    transform: input => FALSELY.includes(input) ? undefined : input
  })

  t.useValidator([Date], {
    preprocess,
    validate: input => input instanceof Date,
    transform: input => {
      switch (typeof input) {
        case 'string':
          // TODO number string or bigint string
          if (isNaN(Date.parse(input))) {
            // TODO throw transform error of parse error
          }
        // eslint-disable-next-line no-fallthrough
        case 'number':
          if (input === Infinity) {
            return new Date(MAX_TIME)
          } else if (input === -Infinity) {
            return new Date(-MAX_TIME)
          }
          return new Date(input)
        case 'bigint': {
          const num = Number(input)
          if (num > Number.MAX_SAFE_INTEGER) {
            return new Date(MAX_TIME)
          } else if (num < Number.MIN_SAFE_INTEGER) {
            return new Date(-MAX_TIME)
          }
          return new Date(num)
        }
      }
    }
  })
}
export { validator }

export * from './base'
export * from './utils'
