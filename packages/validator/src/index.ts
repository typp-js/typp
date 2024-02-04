import type {
  AtLeastOneProperty,
  IsEqual,
  IsNotEqual,
  Narrow,
  Switch,
  t as tn, Typp,
  ValueOf
} from '@typp/core'

import { parseBigInt } from './utils'

interface ValidateExtendsEntries<T> {
  [key: string]: [boolean, any]
  number: [
    [T] extends [number] ? true : false,
    number | Number,
  ]
  string: [
    [T] extends [string] ? true : false,
    string | String
  ]
  boolean: [
    [T] extends [boolean] ? true : false,
    boolean | Boolean
  ]
}
interface ValidateTransformEntries<T, Input> {
  [key: string]: [boolean, any]
  number: [
    [T] extends [number] ? true : false,
    Switch<{
      [k: string]: [boolean, any]
      any: [IsEqual<Input, any>, unknown]
      self: [
        [Input] extends [number] ? true : false,
        number
      ]
      string: [
        [Input] extends [string] ? true : false,
        Input extends (
          | `${number}${string}`
          | `0${'b' | 'B'}${string}`
          | `0${'o' | 'O'}${number}`
          | `0${'x' | 'X'}${string}`
        ) ? number
          : true extends IsEqual<Input, string>
            ? unknown
            : never,
      ]
      boolean: [
        [Input] extends [boolean] ? true : false,
        Input extends true ? 1 : Input extends false ? 0 : never
      ]
      null: [
        [Input] extends [null] ? true : false,
        0
      ]
      undefined: [
        [Input] extends [undefined] ? true : false,
        0
      ]
      bigint: [
        [Input] extends [bigint] ? true : false,
        number
      ]
    }>
  ]
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

declare module '@typp/core' {
  namespace t {
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
      error: ValidateError
    }
    export type ValidateResult<T> = ValidateSuccessResult<T> | ValidateErrorResult
    // type T0 = Switch<ValidateTransformEntries<1, InputRest>>
    export type Validate<
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
      Switch<ValidateTransformEntries<T, InputRest>> extends infer TransformInput ? Validate<
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
      ) ? ValidateResult<Validate<T, ExtendsT, Input, InputRest, Next>>
        : true extends (
          | ([Input] extends [ExtendsT] ? false : true)
          | (IsNotEqual<T, never> & IsEqual<Input, never>)
        ) ? ValidateErrorResult
          : ValidateSuccessResult<Validate<T, ExtendsT, Input, InputRest, Next>>
    ) : [
      Opts['const'], Omit<Opts, 'const'>
    ] extends [
      true, infer Next extends ValidateOptions
    ] ? (
      Validate<
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
        Rest extends true extends(
          | (O['try'] extends true ? true : false)
          | (O['transform'] extends true ? true : false)
        ) ? unknown : never,
        Opts extends ValidateOptions
      >(
        data: ExtendsT | Rest,
        options?: Opts
      ): Validate<T, ExtendsT, typeof data, Exclude<typeof data, ExtendsT>, Opts & O>
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
      ): Validate<T, ExtendsT, typeof data, Exclude<typeof data, ExtendsT>, Opts & O & { const: true }>
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

export class ValidateError extends Error {
  __TYPP_SYMBOL__ = '__ValidateError__'
  constructor(
    public type: string,
    public expected: tn.Schema<any, any>,
    public actual: any
  ) {
    super(`Data is ${type}`)
    this.name = 'ValidateError'
  }
}

export class ParseError extends Error {
  __TYPP_SYMBOL__ = '__ParseError__'
  constructor(
    public step: string,
    public expected: tn.Schema<any, any>,
    public actual: any,
    public detail: Error
  ) {
    super(`Data \`${String(actual)}\` cannot be parsed at \`${step}\`, because ${detail.message}`)
    this.name = 'ParseError'
  }
}

type Resolver = (s: tn.Schema<any, any>, input: unknown, transform?: boolean) => unknown
type Transformer<Shape = unknown> = (
  this: Typp<[Shape]>,
  input: unknown,
  options?: Omit<tn.ValidateOptions, 'transform'>
) => void
type Validator<Shape = unknown> = (
  this: Typp<[Shape]>,
  input: unknown,
  options?: Omit<tn.ValidateOptions, 'transform'>
) => unknown
const resolverMappingByMatcher = [] as [
  matcher: (s: tn.Schema<any, any>, input: unknown) => boolean, resolver: Resolver
][]
const resolverMappingByShape = new Map<unknown, Resolver>()
const mappingByShape = new Map<unknown, AtLeastOneProperty<{
  validate: Validator
  preprocess: Transformer
  transform: Transformer
}>>()

function setResolverByShape<Shape = any>(shape: Shape, resolver: AtLeastOneProperty<{
  validate: Validator<Shape>
  /**
   * always called before `validate`, error will be catched and thrown as `ParseError`
   */
  preprocess: Transformer<Shape>
  /**
   * only when `transform` is `true` and validate failed, this function will be called
   * error will be catched and thrown as `ParseError`
   */
  transform: Transformer<Shape>
}>) {
  mappingByShape.set(shape, resolver)
}
// 如果俩个类型之间不支持转化，应该抛出「校验错误」还是「转化错误」？
// 实际上来说，一个值不能作为某个类型使用，存在俩种情况
// - 这个值不能被转化为目标的类型
//   - `{ a: 1 }` 就是转化不到 `number` 的
//     `{ a: 1, b: 2 }` 是可以转化到 `{ a: number }` 的，只需要删除掉多余的部分就可以了
// - 这个值就是不匹配目标类型，哪怕转化了也是
//   - `1` 就是不匹配 `'2' | '3'` 的
//   - `{}` 并不在 `number` 的转化范围内，是一个无法被转化的值，这个时候应该抛出「校验错误」的异常，而不是「无法转化」的异常
setResolverByShape(Number, {
  preprocess: input => input instanceof Number ? Number(input) : input,
  validate: input => typeof input === 'number',
  transform(input) {
    let data = input
    switch (typeof input) {
      case 'string': {
        if (input === 'NaN') data = NaN
        if (input === 'Infinity') data = Infinity
        if (input === '-Infinity') data = -Infinity
        if (input === '') data = 0
        let radix = 10
        if (input.length > 2) {
          const radixStr = input.slice(0, 2).toLowerCase()
          radix = { '0b': 2, '0o': 8, '0x': 16 }[radixStr] ?? radix
        }
        let inputStr = input
        if (radix !== 10) {
          inputStr = input.slice(2)
        }
        const temp = radix === 10
          ? parseFloat(inputStr)
          : parseInt(inputStr, radix)
        if (!Number.isNaN(temp)) {
          data = temp
        }
        break
      }
      case 'boolean':
        data = input ? 1 : 0
        break
      case 'object':
        if (input === null) data = 0
        break
      case 'undefined':
        data = 0
        break
      case 'bigint':
        if (input > Number.MAX_SAFE_INTEGER) {
          return Infinity
        }
        if (input < Number.MIN_SAFE_INTEGER) {
          return -Infinity
        }
        data = Number(input)
        break
    }
    return data
  }
})
// TODO extensible ?
export const falsely = [
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
resolverMappingByShape.set(BigInt, (skm, input, transform) => {
  let data = input
  const notMatched = () => typeof data !== 'bigint'
  if (transform && notMatched()) {
    if (falsely.includes(input)) {
      data = 0n
    }
    switch (typeof input) {
      case 'number':
        if (input === Infinity) {
          data = 2n ** 1024n
        } else if (input === -Infinity) {
          data = 2n ** 1024n * -1n
        } else if (Number.isNaN(input)) {
          // TODO throw transform error of parse error
          break
        } else if (Number.isInteger(input)) {
          data = BigInt(input)
        } else {
          data = BigInt(Math.floor(input))
        }
        break
      case 'string':
        data = parseBigInt(input)
        break
      case 'boolean':
        data = input ? 1n : 0n
        break
    }
  }
  if (notMatched()) {
    throw new ValidateError('unexpected', skm, input)
  }
  return data
})
resolverMappingByShape.set(String, (skm, input, transform) => {
  let data = input
  const notMatched = () => typeof data !== 'string'
  if (transform && notMatched()) {
    data = String(input)
  }
  if (notMatched()) {
    throw new ValidateError('unexpected', skm, input)
  }
  return data
})
resolverMappingByShape.set(Boolean, (skm, input, transform) => {
  let data = input
  const notMatched = () => typeof data !== 'boolean'
  if (transform && notMatched()) {
    if (falsely.includes(input)) {
      data = false
    } else {
      data = Boolean(input)
    }
  }
  if (notMatched()) {
    throw new ValidateError('unexpected', skm, input)
  }
  return data
})
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
  if (mappingByShape.has(this.shape)) {
    const {
      transform: isTransform = false
    } = options
    const {
      preprocess: preprocessNoThis,
      validate: validateNoThis,
      transform: transformNoThis
    } = mappingByShape.get(this.shape) ?? {}
    const [
      validate, transform, preprocess
    ] = [validateNoThis, transformNoThis, preprocessNoThis].map(fn => fn?.bind(this))
    if (!validate)
      throw new Error(`Unable to validate when shape is ${this.shape}, because the shape is not supported validator`)

    try {
      rt = preprocess ? preprocess(rt, options) : rt
    } catch (e) {
      if (e instanceof Error) {
        throw new ParseError('preprocess', this, rt, e)
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
          throw new ParseError('transform', this, rt, e)
        }
        throw e
      }
    }
    if (!validate(rt, options))
      throw new ValidateError('unexpected', this, rt)
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

function catchAndWrap(func: Function): tn.ValidateResult<any> {
  try {
    return { success: true, data: func() }
  } catch (error) {
    const e = error as any
    if (
      e instanceof ValidateError
      /* istanbul ignore next */
      || e?.__TYPP_SYMBOL__ === '__ValidateError__'
      || e instanceof ParseError
      /* istanbul ignore next */
      || e?.__TYPP_SYMBOL__ === '__ParseError__'
    ) {
      return { success: false, error: e }
    }
    throw error
  }
}
function catchAndWrapProxy<T extends Function>(func: T, proxyHandler: Omit<ProxyHandler<any>, 'apply'> = {}): T {
  return new Proxy(func, {
    ...proxyHandler,
    apply(target, thisArg, args) {
      return catchAndWrap(() => Reflect.apply(target, thisArg, args))
    }
  })
}

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
        if (e instanceof ValidateError) {
          return false
        }
        throw e
      }
    }
  })
}
export { validator }
