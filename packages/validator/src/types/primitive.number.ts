import type { IsEqual, Switch, t as tn } from '@typp/core'

import { FALSELY } from '../base'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      number: [
        [T] extends [number] ? true : false,
        number | Number,
      ]
    }
    export interface ValidateTransformEntries<T, Input> {
      number: [
        [T] extends [number] ? true : false,
        Switch<{
          [k: string]: [boolean, any]
          any: [IsEqual<Input, any>, unknown]
          self: [
            [Input] extends [number] ? true : false,
            number
          ]
          string: [
            [Input] extends [string] ? true : false,
            Input extends (
                | `${number}${string}`
                | `0${'b' | 'B'}${string}`
                | `0${'o' | 'O'}${number}`
                | `0${'x' | 'X'}${string}`
                ) ? number
              : true extends IsEqual<Input, string>
                ? unknown
                : never,
          ]
          boolean: [
            [Input] extends [boolean] ? true : false,
            Input extends true ? 1 : Input extends false ? 0 : never
          ]
          null: [
            [Input] extends [null] ? true : false,
            0
          ]
          undefined: [
            [Input] extends [undefined] ? true : false,
            0
          ]
          bigint: [
            [Input] extends [bigint] ? true : false,
            number
          ]
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
      if (FALSELY.includes(input)) return 0

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
