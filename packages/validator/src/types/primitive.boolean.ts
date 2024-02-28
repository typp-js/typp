import type { IsEqual, IsWhat, OnlySubType, t as tn } from '@typp/core'

import { FALSY } from '../base'
import type { SwitchBaseType } from '../base.inner'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      boolean: [
        IsWhat<T, boolean>, boolean | Boolean,
      ]
      'literal:boolean': [
        OnlySubType<T, boolean>, T & boolean
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      boolean: [
        [T] extends [boolean] ? true : false,
        SwitchBaseType<Input, InputRest, 'boolean', {
          bigint: boolean
          boolean:
            [InputRest] extends [never] ? (
              Input extends infer UnionInputItem ? (
                IsEqual<UnionInputItem, Boolean> extends true
                  ? boolean
                  : Extract<UnionInputItem, boolean>
              ) : never
            ) : never
          number: boolean
          string: boolean
          symbol: never
          null: false
          undefined: false
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
