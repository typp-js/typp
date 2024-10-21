import type { t as tn } from '@typp/core/base'
import type {} from '@typp/core/consumers/primitive'
import { FALSY } from '@typp/validator/constants'
import type {} from '@typp/validator/extends'
import type { SwitchBaseType } from '@typp/validator/types'
import { bigintTransform } from '@typp/validator/typings/primitive.bigint'
import { booleanTransform } from '@typp/validator/typings/primitive.boolean'
import { numberTransform } from '@typp/validator/typings/primitive.number'
import { stringTransform } from '@typp/validator/typings/primitive.string'
import { symbolTransform } from '@typp/validator/typings/primitive.symbol'
import { preprocess } from '@typp/validator/utils'

declare module '@typp/core/base' {
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
    bigint | boolean | number | string | symbol,
    bigint | boolean | number | string | symbol
  > =>
    [
      'bigint',
      'boolean',
      'number',
      'string',
      'symbol'
    ].includes(typeof s.shape), {
    validate(input) {
      return input === this.shape
    },
    transform(input, options) {
      return (<Record<string, Function>> {
        bigint: bigintTransform,
        boolean: booleanTransform,
        number: numberTransform,
        string: stringTransform,
        symbol: symbolTransform
      })[typeof this.shape as string]?.call(this as any, input, options)
    }
  })
}
