import type { t as tn } from '@typp/core'

import type { SwitchBaseType } from '../base.inner'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      string: [
        [T] extends [string] ? true : false,
        string | String
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

export function stringValidator(t: typeof tn) {
  t.useValidator([String], {
    preprocess,
    validate: input => typeof input === 'string',
    transform: input => String(input)
  })
}
