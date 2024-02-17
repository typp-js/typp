import type { t as tn } from '@typp/core'

import { FALSY } from '../base'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      null: [
        [T] extends [null] ? true : false,
        null
      ]
      undefined: [
        [T] extends [undefined] ? true : false,
        undefined
      ]
    }
    export interface ValidateTransformEntries<T, Input> {
      null: [
        [T] extends [null] ? true : false,
        [Input] extends [null] ? null : unknown
      ]
      undefined: [
        [T] extends [undefined] ? true : false,
        [Input] extends [undefined] ? undefined : unknown
      ]
    }
  }
}

export function literalValidator(t: typeof tn) {
  t.useValidator([null], {
    preprocess,
    validate: input => input === null,
    transform: input => FALSY.includes(input) ? null : input
  })
  t.useValidator([undefined], {
    preprocess,
    validate: input => input === undefined,
    transform: input => FALSY.includes(input) ? undefined : input
  })
}
