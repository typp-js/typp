import type {
  IsEqual,
  IsNotEqual,
  Narrow,
  Switch,
  t as tn,
  ValueOf
} from '@typp/core'

interface TransformExtendsEntries<T, Input> {
  [key: string]: [boolean, any, any, any]
  number: [
    [T] extends [number] ? true : false,
    number,
    number | string | boolean | null | undefined | bigint,
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
    string,
    any,
    string
  ]
}
type TransformExtendsMapping<
  T, Input,
  Entries extends TransformExtendsEntries<T, Input> = TransformExtendsEntries<T, Input>
> = ValueOf<{
  [ K in keyof Entries
    as [Entries[K][0]] extends [true] ? K : never
  ]: Entries[K][3]
}>

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
    export type Validate<T, Input, InputRest, Opts extends ValidateOptions> = [
      Opts['transform'], Omit<Opts, 'transform'>
    ] extends [
      true, infer Next extends ValidateOptions
    ] ? (
      TransformExtendsMapping<T, InputRest> extends infer TransformInput ? Validate<
        T,
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
      ) ? ValidateResult<Validate<T, Input, InputRest, Next>>
        : true extends (
          | ([Input] extends [T] ? false : true)
          | (IsNotEqual<T, never> & IsEqual<Input, never>)
        ) ? ValidateErrorResult
          : ValidateSuccessResult<Validate<T, Input, InputRest, Next>>
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
        Input, InputRest, Next
      >
    ) : (
      true extends (
        (
          | ([Input] extends [T] ? true : false)
          | IsEqual<Input, unknown>
        )
        & IsNotEqual<Input, never>
      ) ? T : never
    )
    interface ValidateItf<Shape, T, O extends ValidateOptions = {}> {
      <
        Rest extends true extends(
          | (O['try'] extends true ? true : false)
          | (O['transform'] extends true ? true : false)
        ) ? unknown : never,
        Opts extends ValidateOptions
      >(
        data: T | Rest,
        options?: Opts
      ): Validate<T, typeof data, Exclude<typeof data, T>, Opts & O>
      narrow<
        TT extends T,
        Rest extends true extends(
          | (O['try'] extends true ? true : false)
          | (O['transform'] extends true ? true : false)
        ) ? unknown : never,
        Opts extends ValidateOptions
      >(
        data: Narrow<TT | Rest>,
        options?: Opts
      ): Validate<T, typeof data, Exclude<typeof data, T>, Opts & O & { const: true }>
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

type Resolver = (s: tn.Schema<any, any>, input: unknown, transform?: boolean) => unknown
const resolverMappingByMatcher = [] as [
  matcher: (s: tn.Schema<any, any>, input: unknown) => boolean, resolver: Resolver
][]
const resolverMappingByShape = new Map<unknown, Resolver>()

resolverMappingByShape.set(Number, (skm, input, transform) => {
  let data = input
  if (transform) {
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
  }
  if (typeof data !== 'number') {
    throw new ValidateError('unexpected', skm, input)
  }
  return data
})
resolverMappingByShape.set(String, (skm, input, transform) => {
  let data = input
  if (transform) {
    data = String(input)
  }
  if (typeof data !== 'string') {
    throw new ValidateError('unexpected', skm, input)
  }
  return data
})
function validate(this: tn.Schema<any, any>, data: any, options?: tn.ValidateOptions): any
function validate(this: tn.Schema<any, any>, ...args: any[]) {
  if (args.length === 0)
    throw new Error('No data to validate')
  const [data, options] = args
  // TODO
  //  完全匹配
  //  部分匹配，部分缺失或不匹配: partially
  //  完全不匹配: unexpected
  //  完全匹配但超过了原类型: excessive
  let rt = data
  if (resolverMappingByShape.has(this.shape)) {
    rt = resolverMappingByShape.get(this.shape)?.(this, data, options?.transform)
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
