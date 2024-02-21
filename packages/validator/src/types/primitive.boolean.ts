import type { IsEqual, IsIntersect, Switch, t as tn } from '@typp/core'

import { FALSY } from '../base'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      boolean: [
        [T] extends [boolean] ? true : false,
        boolean | Boolean,
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      boolean: [
        [T] extends [boolean] ? true : false,
        Switch<{
          any: [IsEqual<Input, any>, unknown]
          boolean: [
            true extends (
              | IsIntersect<Input, true>
              | IsIntersect<Input, false>
              | IsIntersect<Input, Boolean>
            ) ? true : false,
            [InputRest] extends [never] ? (
              Input extends infer UnionInputItem ? (
                IsEqual<UnionInputItem, Boolean> extends true
                  ? boolean
                  : Extract<UnionInputItem, boolean>
              ) : never
            ) : never
          ]
          bigint: [
            true extends (
              | IsIntersect<InputRest, bigint>
              | IsIntersect<InputRest, BigInt>
            ) ? true : false,
            boolean
          ]
          number: [
            true extends (
              | IsIntersect<InputRest, number>
              | IsIntersect<InputRest, Number>
            ) ? true : false,
            boolean
          ]
          string: [
            true extends (
              | IsIntersect<InputRest, string>
              | IsIntersect<InputRest, String>
            ) ? true : false,
            boolean
          ]
          nullOrUndefined: [
            true extends (
              | IsIntersect<InputRest, null>
              | IsIntersect<InputRest, undefined>
            ) ? true : false,
            false
          ]
        }>
      ]
    }
  }
}

export function booleanValidator(t: typeof tn) {
  t.useValidator([Boolean], {
    preprocess,
    validate: input => typeof input === 'boolean',
    transform: input => FALSY.includes(input) ? false : Boolean(input)
  })
}
