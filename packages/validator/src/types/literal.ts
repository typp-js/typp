import type { IsEqual, Switch, t as tn } from '@typp/core'

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
    export interface ValidateTransformEntries<T, InputRest> {
      null: [
        [T] extends [null] ? true : false,
        true extends IsEqual<InputRest, never>
          ? never
          : Switch<{
              any: [IsEqual<InputRest, any>, unknown]
              unknown: [IsEqual<InputRest, unknown>, unknown]
              string: [
                [InputRest] extends [string] ? true : false,
                unknown
              ]
              number: [
                [InputRest] extends [number] ? true : false,
                [InputRest] extends [0]
                  ? null : unknown
              ]
              bigint: [
                [InputRest] extends [bigint] ? true : false,
                [InputRest] extends [0n]
                  ? null : unknown
              ]
              boolean: [
                [InputRest] extends [boolean] ? true : false,
                [InputRest] extends [false] ? null : never
              ]
              symbol: [
                [InputRest] extends [symbol] ? true : false,
                never
              ]
              null: [
                [InputRest] extends [null] ? true : false,
                null
              ]
              undefined: [
                [InputRest] extends [undefined] ? true : false,
                null
              ]
            }>
          ]
      undefined: [
        [T] extends [undefined] ? true : false,
        undefined
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
