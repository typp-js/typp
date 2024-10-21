import type { t as tn } from '@typp/core/base'
import { toPrimitive } from '@typp/validator/utils'

declare module '@typp/core/base' {
  namespace t {
    export interface ErrorArgsMap {
      [k: string]: unknown[]
    }
    export { ParseError, ValidateError }
  }
}

export type ErrorArgsMapKeys = keyof tn.ErrorArgsMap
export type GetErrorArgs<K extends ErrorArgsMapKeys> = tn.ErrorArgsMap[K]

export class ValidateError<K extends ErrorArgsMapKeys = string> extends Error {
  __TYPP_SYMBOL__ = '__ValidateError__'
  constructor(
    public type: string,
    public expected: tn.Schema<any, any>,
    public actual: any,
    public keyword?: K,
    public args?: GetErrorArgs<K>
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
    let actualStr = ''
    try {
      actualStr = JSON.stringify(actual)
    } catch {
      actualStr = String(toPrimitive(actual))
    }
    super(`Data \`${actualStr}\` cannot be parsed at \`${step}\`, because ${detail.message}`)
    this.name = 'ParseError'
  }
}

export function isWhatError<K extends ErrorArgsMapKeys>(
  error: unknown,
  key: K
): error is { keyword: K; args: GetErrorArgs<K> } {
  if (typeof error !== 'object' || error === null) {
    return false
  }
  return 'keyword' in error && error.keyword === key
}
