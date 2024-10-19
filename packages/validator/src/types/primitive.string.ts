import type { LiteralTypeGuard, SwitchBaseType } from '#internal'

import type { IsWhat, OnlySubType, t as tn } from '@typp/core/base'
import { preprocess } from '@typp/validator/utils'

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      string: [
        IsWhat<T, string>, string | String,
      ]
      'literal:string': [
        OnlySubType<T, string>, T & string
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      string: [
        [T] extends [string] ? true : false,
        LiteralTypeGuard<string, T, SwitchBaseType<Input, InputRest, 'string', {
          bigint: `${InputRest & bigint}`
          boolean: `${InputRest & boolean}`
          number: `${InputRest & number}`
          string: Input & string
          symbol: string
          null: 'null'
          undefined: 'undefined'
        }, string>>
      ]
    }
  }
}

export const stringTransform: tn.Validator<string>['transform'] = function(input, options) {
  return String(input)
}

export function stringValidator(t: typeof tn) {
  t.useValidator([String], {
    preprocess,
    validate: input => typeof input === 'string',
    transform: stringTransform
  })
}
