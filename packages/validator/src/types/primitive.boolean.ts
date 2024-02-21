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
    export interface ValidateTransformEntries<T, Input, InputRest> {
      boolean: [
        [T] extends [boolean] ? true : false,
        Switch<{
          any: [IsEqual<Input, any>, unknown]
          bigint: [
            [Input] extends [bigint] ? true : false,
            boolean
          ]
          self: [
            [Input] extends [boolean] ? true : false,
            boolean
          ]
          number: [
            [Input] extends [number] ? true : false,
            boolean
          ]
          string: [
            [Input] extends [string] ? true : false,
            boolean,
          ]
          nullOrUndefined: [
            [Input] extends [null | undefined] ? true : false,
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
