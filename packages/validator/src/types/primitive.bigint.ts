import type { IsEqual, IsSubType, Switch, t as tn } from '@typp/core'

import { FALSY } from '../base'
import { parseBigInt } from '../utils'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      bigint: [
        [T] extends [bigint] ? true : false,
        bigint | BigInt,
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      bigint: [
        [T] extends [bigint] ? true : false,
        Switch<{
          any: [IsEqual<Input, any>, unknown]
          number: [
            true extends (
              | IsSubType<InputRest, number>
              | IsSubType<InputRest, Number>
            ) ? true : false,
            // TODO `${Input}n` extends `${O extends bigint}` ? O : never
            bigint
          ]
          bigint: [
            true extends (
              | IsSubType<Input, bigint>
              | IsSubType<Input, BigInt>
            ) ? true : false,
            [InputRest] extends [never] ? (
              Input extends infer UnionInputItem ? (
                IsEqual<UnionInputItem, BigInt> extends true
                  ? bigint
                  : Extract<UnionInputItem, bigint>
              ) : never
            ) : never
          ]
          string: [
            IsSubType<InputRest, string>,
            InputRest extends (
              | `${number}${string}`
              | `0${'b' | 'B'}${string}`
              | `0${'o' | 'O'}${number}`
              | `0${'x' | 'X'}${string}`
            ) ? bigint
              : true extends IsEqual<InputRest, string>
                ? unknown
                : never,
          ]
          boolean: [
            true extends (
              | IsSubType<InputRest, true>
              | IsSubType<InputRest, false>
            ) ? true : false,
            InputRest extends true ? 1n : InputRest extends false ? 0n : never
          ]
          null: [IsSubType<InputRest, null>, 0n]
          undefined: [IsSubType<InputRest, undefined>, 0n]
        }>
      ]
    }
  }
}

export function bigintValidator(t: typeof tn) {
  t.useValidator([BigInt], {
    preprocess,
    validate: input => typeof input === 'bigint',
    transform(input) {
      if (FALSY.includes(input)) return 0n

      switch (typeof input) {
        case 'number':
          if (input === Infinity) {
            return 2n ** 1024n
          } else if (input === -Infinity) {
            return 2n ** 1024n * -1n
          } else if (Number.isNaN(input)) {
            throw new Error('NaN cannot be converted to BigInt')
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
  })
}
