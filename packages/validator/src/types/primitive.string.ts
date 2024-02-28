import type { IsWhat, OnlySubType, t as tn } from '@typp/core'

import type { SwitchBaseType } from '../base.inner'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
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
        SwitchBaseType<Input, InputRest, 'string', {
          bigint: `${bigint}`
          boolean: 'true' | 'false'
          number: `${number}`
          string: string
          symbol: string
          null: 'null'
          undefined: 'undefined'
        }>
      ]
    }
  }
}

export const stringTransform: tn.Validator<string>['transform'] = function (input, options) {
  return String(input)
}

export function stringValidator(t: typeof tn) {
  t.useValidator([String], {
    preprocess,
    validate: input => typeof input === 'string',
    transform: stringTransform
  })
}
