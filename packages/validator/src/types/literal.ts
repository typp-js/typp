import type { t as tn } from '@typp/core'

import { FALSY } from '../base'
import type { SwitchBaseType } from '../base.inner'
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
    export interface ValidateTransformEntries<T, Input, InputRest> {
      null: [
        [T] extends [null] ? true : false,
        SwitchBaseType<Input, InputRest, 'null', {
          bigint: [Input] extends [0n] ? null : unknown
          boolean: InputRest extends true ? 1 : InputRest extends false ? 0 : never
          number: [Input] extends [0] ? null : unknown
          string: unknown
          symbol: never
          null: null
          undefined: null
        }>
      ]
      undefined: [
        [T] extends [undefined] ? true : false,
        SwitchBaseType<Input, InputRest, 'undefined', {
          bigint: [Input] extends [0n] ? undefined : unknown
          boolean: InputRest extends true ? 1 : InputRest extends false ? 0 : never
          number: [Input] extends [0] ? undefined : unknown
          string: unknown
          symbol: never
          null: undefined
          undefined: undefined
        }>
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
  t.useValidator((s): s is tn.Schema<
    string | number | bigint | symbol | boolean,
    string | number | bigint | symbol | boolean
  > => typeof s.shape !== 'object', {
    validate(input) {
      return input === this.shape
    }
  })
}
