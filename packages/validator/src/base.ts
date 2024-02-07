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

// [§21.4.1.1 Time Values and Time Range]
// > A Number can exactly represent all integers from -9,007,199,254,740,992 to 9,007,199,254,740,992 (21.1.2.8 and 21.1.2.6).
// > A time value supports a slightly smaller range of -8,640,000,000,000,000 to 8,640,000,000,000,000 milliseconds.
// > This yields a supported time value range of exactly -100,000,000 days to 100,000,000 days relative to midnight
// > at the beginning of 1 January 1970 UTC.
// 100_000_000 * 24 * 60 * 60 * 1000
export const MAX_TIME = 8640000000000000

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
