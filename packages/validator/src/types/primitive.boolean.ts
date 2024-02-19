import type { IsEqual, Switch, t as tn } from '@typp/core'

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
    export interface ValidateTransformEntries<T, InputRest> {
      boolean: [
        [T] extends [boolean] ? true : false,
        Switch<{
          any: [IsEqual<InputRest, any>, unknown]
          bigint: [
            [InputRest] extends [bigint] ? true : false,
            boolean
          ]
          self: [
            [InputRest] extends [boolean] ? true : false,
            boolean
          ]
          number: [
            [InputRest] extends [number] ? true : false,
            boolean
          ]
          string: [
            [InputRest] extends [string] ? true : false,
            boolean,
          ]
          nullOrUndefined: [
            [InputRest] extends [null | undefined] ? true : false,
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
