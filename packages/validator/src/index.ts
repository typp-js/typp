import type { IsEqual, Narrow, t as tn } from '@typp/core'

declare module '@typp/core' {
  namespace t {
    export const coerce: typeof t
    interface ValidateOptions {
      strict?: boolean
      transform?: boolean
    }
    export type ValidateSuccess<T> = {
      success: true
      data: T
    }
    export type ValidateError = {
      success: false
      error: ValidateError
    }
    export type ValidateResult<T> = ValidateSuccess<T> | ValidateError
    interface SchemaFieldsAll<Shape, T> {
      /**
       * 根据数据定义格式校验数据，当数据满足格式时返回数据本身，引用不变化。
       * 但是如果数据不满足格式，则抛出校验异常，外部需要对校验异常和可能存在的其他异常进行处理。
       */
      validate: (
        & ((data: T, options?: ValidateOptions) => T)
        & {
          narrow<TT extends T>(data: Narrow<TT>): TT
        }
      )
      /**
       * 与 validate 函数类似，但是在出现异常时会将校验异常捕获并包装后返回。
       */
      tryValidate: (
        & (<Rest>(data: T | Rest, options?: ValidateOptions) => (
          true extends (
            | IsEqual<Rest, any>
            | IsEqual<Rest, unknown>
          ) ? ValidateResult<T>
            : [Rest] extends [T] ? ValidateSuccess<T> : ValidateError
        ))
        & {
          narrow<TT extends T>(data: Narrow<TT>): ValidateSuccess<TT>
        }
      )
      // for zod
      safeParse: this['tryValidate']
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
        const temp = parseInt(input, radix)
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
function validate(this: tn.Schema<any, any>, data: any, options?: tn.ValidateOptions) {
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
    }
  })
}
export { validator }
