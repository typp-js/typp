import type { IsEqual, Narrow, t as tn } from '@typp/core'

declare module '@typp/core' {
  namespace t {
    export const coerce: typeof t
    interface ParseOptions {
      strict?: boolean
    }
    export type ParseSuccess<T> = {
      success: true
      data: T
    }
    export type ParseError = {
      success: false
      error: ValidateError
    }
    export type ParseResult<T> = ParseSuccess<T> | ParseError
    interface SchemaFieldsAll<Shape, T> {
      /**
       * 根据数据定义格式校验数据，当数据满足格式时返回数据本身，引用不变化。
       * 但是如果数据不满足格式，则抛出校验异常，外部需要对校验异常和可能存在的其他异常进行处理。
       */
      parse: (
        & ((data: T) => T)
        & {
          narrow<TT extends T>(data: Narrow<TT>): TT
        }
      )
      /**
       * 与 parse 函数类似，但是在出现异常时会将校验异常捕获并包装后返回。
       */
      tryParse: (
        & (<Rest>(data: T | Rest) => (
          true extends (
            | IsEqual<Rest, any>
            | IsEqual<Rest, unknown>
          ) ? ParseResult<T>
            : [Rest] extends [T] ? ParseSuccess<T> : ParseError
        ))
        & {
          narrow<TT extends T>(data: Narrow<TT>): ParseSuccess<TT>
        }
      )
      // for zod
      safeParse: this['tryParse']
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

function parse(this: tn.Schema<any, any>, data: any) {
  // TODO
  //  完全匹配
  //  部分匹配，部分缺失或不匹配: partially
  //  完全不匹配: unexpected
  //  完全匹配但超过了原类型: inexactly
  if (this.shape === Number) {
    if (typeof data !== 'number') {
      throw new ValidateError('unexpected', this, data)
    }
  }
  return data
}
parse.narrow = parse

function catchAndWrap(func: Function): tn.ParseResult<any> {
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
}
export { validator }
