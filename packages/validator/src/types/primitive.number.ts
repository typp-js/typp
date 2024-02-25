import type { IsAnySubType, IsEqual, IsSubType, Switch, t as tn } from '@typp/core'

import { FALSY } from '../base'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      number: [
        [T] extends [number] ? true : false,
        number | Number,
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      number: [
        [T] extends [number] ? true : false,
        Switch<{
          any: [IsEqual<Input, any>, unknown]
          number: [
            IsAnySubType<Input, number | Number>,
            [InputRest] extends [never] ? (
              Input extends infer UnionInputItem ? (
                IsEqual<UnionInputItem, Number> extends true
                  ? number
                  : Extract<UnionInputItem, number>
              ) : never
            ) : never
          ]
          bigint: [
            IsAnySubType<InputRest, bigint | BigInt>,
            number,
            // TODO infer narrow number
            // `${InputRest & bigint}` extends `${infer T extends number}` ? T : never,
          ]
          string: [
            IsAnySubType<InputRest, string | String>,
            InputRest extends (
              // TODO infer narrow number
              // | `${infer T extends number}${string}`
              | `${number}${string}`
              | `0${'b' | 'B'}${string}`
              | `0${'o' | 'O'}${number}`
              | `0${'x' | 'X'}${string}`
            ) ? number
              : true extends IsEqual<InputRest, string>
                ? unknown
                : never,
          ]
          boolean: [
            IsAnySubType<InputRest, true | false>,
            InputRest extends true ? 1 : InputRest extends false ? 0 : never
          ]
          null: [IsSubType<InputRest, null>, 0]
          undefined: [IsSubType<InputRest, undefined>, 0]
        }>
      ]
    }
  }
}
export function numberValidator(t: typeof tn) {
  t.useValidator([Number], {
    preprocess,
    validate: input => typeof input === 'number',
    transform(input) {
      if (FALSY.includes(input)) return 0

      switch (typeof input) {
        case 'string': {
          if (input === 'NaN') {
            return NaN
          } else if (input === 'Infinity') {
            return Infinity
          } else if (input === '-Infinity') {
            return -Infinity
          } else if (input === '') {
            return 0
          }

          let radix = 10
          if (input.length > 2) {
            const radixStr = input.slice(0, 2).toLowerCase()
            radix = { '0b': 2, '0o': 8, '0x': 16 }[radixStr] ?? radix
          }
          let inputStr = input
          if (radix !== 10) {
            inputStr = input.slice(2)
          }
          const temp = radix === 10
            ? parseFloat(inputStr)
            : parseInt(inputStr, radix)

          if (!Number.isNaN(temp))
            return temp
          break
        }
        case 'boolean':
          return input ? 1 : 0
        case 'bigint':
          if (input > Number.MAX_SAFE_INTEGER) return Infinity
          if (input < Number.MIN_SAFE_INTEGER) return -Infinity
          return Number(input)
      }
      // TODO Date
      return input
    }
  })
}
