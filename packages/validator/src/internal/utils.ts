import type { t as tn } from '@typp/core'
import { toPrimitive } from '@typp/validator/utils'

import { ParseError, ValidateError } from '.'

export const preprocess: tn.Validator['preprocess'] = (input, options) => toPrimitive(input)

export function catchAndWrap(func: Function): tn.ValidateResult<any> {
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

export function catchAndWrapProxy<T extends Function>(func: T, proxyHandler: Omit<ProxyHandler<any>, 'apply'> = {}): T {
  return new Proxy(func, {
    ...proxyHandler,
    apply(target, thisArg, args) {
      return catchAndWrap(() => Reflect.apply(target, thisArg, args))
    }
  })
}
