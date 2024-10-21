import ''

import type { LiteralTypeGuard, SwitchBaseType } from '#internal'

import type { IsEqual, IsWhat, OnlySubType, t as tn } from '@typp/core/base'
import { FALSY } from '@typp/validator/constants'
import { preprocess } from '@typp/validator/utils'

// dprint-ignore
declare module '@typp/core/base' {
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
        LiteralTypeGuard<boolean, T, SwitchBaseType<Input, InputRest, 'boolean', {
          bigint: boolean
          boolean:
            [InputRest] extends [never] ? (
              Input extends infer UnionInputItem ? (
                IsEqual<UnionInputItem, Boolean> extends true
                  ? boolean
                  : Extract<UnionInputItem, boolean>
              ) : never
            ) : never
          number: InputRest extends 0 ? false : true
          // TODO replace by `Falsy`
          string: InputRest extends 'false' ? false : true
          symbol: never
          null: false
          undefined: false
        }>>
      ]
    }
  }
}

export const booleanTransform: tn.Validator<boolean>['transform'] = function(input, options) {
  return FALSY.includes(input) ? false : Boolean(input)
}

export function booleanValidator(t: typeof tn) {
  t.useValidator([Boolean], {
    preprocess,
    validate: input => typeof input === 'boolean',
    transform: booleanTransform
  })
}
