import '@typp/validator/types'

import type { LiteralTypeGuard, SwitchBaseType } from '#internal'

import type { IsEqual, IsWhat, Not, OnlySubType, t as tn } from '@typp/core/base'
import { FALSY } from '@typp/validator/constants'
import { parseBigInt, preprocess } from '@typp/validator/utils'

// dprint-ignore
declare module '@typp/core/base' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      bigint: [IsWhat<T, bigint>, bigint | BigInt]
      'literal:bigint': [
        OnlySubType<T, bigint>, T & bigint
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      bigint: [
        [T] extends [bigint] ? true : false,
        LiteralTypeGuard<bigint, T, SwitchBaseType<Input, InputRest, 'bigint', {
          bigint:
            [InputRest] extends [never] ? (
              Input extends infer UnionInputItem ? (
                IsEqual<UnionInputItem, BigInt> extends true
                  ? bigint
                  : Extract<UnionInputItem, bigint>
              ) : never
            ) : never
          boolean:
            InputRest extends true ? 1n : InputRest extends false ? 0n : never
          number: IsWhat<InputRest & number, number> extends false
            ? `${InputRest & number}` extends `${infer O extends bigint}`
              ? O
              : never
            : bigint
          string:
            InputRest extends (
              | `${'-' | '+' | ''}${infer O extends bigint}${string}`
              | `0${'b' | 'B'}${string}`
              | `0${'o' | 'O'}${number}`
              | `0${'x' | 'X'}${string}`
            ) ? (
              Not<IsWhat<O, never>> extends true
                ? O
                : bigint
            ) : true extends IsEqual<InputRest, string>
                ? unknown
                : never
          symbol: never
          null: 0n
          undefined: 0n
        }>>
      ]
    }
  }
}

export const bigintTransform: tn.Validator<bigint>['transform'] = function(input, options) {
  if (FALSY.includes(input)) return 0n

  switch (typeof input) {
    case 'number':
      if (input === Infinity) {
        return 2n ** 1024n
      } else if (input === -Infinity) {
        return 2n ** 1024n * -1n
      } else if (Number.isNaN(input)) {
        throw new TypeError('NaN cannot be converted to BigInt')
      } else {
        if (input > Number.MAX_SAFE_INTEGER || input < Number.MIN_SAFE_INTEGER) {
          throw new Error('number must greater than or equal to -2^53 and less than or equal to 2^53')
        }
        if (Number.isInteger(input)) {
          return BigInt(input)
        } else {
          return BigInt(Math.floor(input))
        }
      }
    case 'string':
      return parseBigInt(input)
    case 'boolean':
      return input ? 1n : 0n
  }
  // TODO Date
  return input
}

export function bigintValidator(t: typeof tn) {
  t.useValidator([BigInt], {
    preprocess,
    validate: input => typeof input === 'bigint',
    transform: bigintTransform
  })
}
