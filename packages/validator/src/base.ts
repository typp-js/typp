import type { t as tn } from '@typp/core'

import { toPrimitive } from './utils'

// TODO extensible ?
export const FALSELY = [
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
