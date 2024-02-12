import type { IsEqual, Switch, t as tn } from '@typp/core'

import { FALSY } from '../base'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      string: [
        [T] extends [string] ? true : false,
        string | String
      ]
    }
    export interface ValidateTransformEntries<T, Input> {
      string: [
        [T] extends [string] ? true : false,
        string
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
