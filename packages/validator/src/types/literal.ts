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
    export interface ValidateTransformEntries<T, Input> {
      null: [
        [T] extends [null] ? true : false,
        true extends IsEqual<Input, never>
          ? never
          : Switch<{
              any: [IsEqual<Input, any>, unknown]
              unknown: [IsEqual<Input, unknown>, unknown]
              string: [
                [Input] extends [string] ? true : false,
                unknown
              ]
              number: [
                [Input] extends [number] ? true : false,
                [Input] extends [0]
                  ? null : unknown
              ]
              bigint: [
                [Input] extends [bigint] ? true : false,
                [Input] extends [0n]
                  ? null : unknown
              ]
              boolean: [
                [Input] extends [boolean] ? true : false,
                [Input] extends [false] ? null : never
              ]
              symbol: [
                [Input] extends [symbol] ? true : false,
                never
              ]
              null: [
                [Input] extends [null] ? true : false,
                null
              ]
              undefined: [
                [Input] extends [undefined] ? true : false,
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
