import type { IsEqual, IsWhat, Not, OnlySubType, t as tn } from '@typp/core'

import { FALSY } from '../base'
import type { LiteralTypeGuard, SwitchBaseType } from '../base.inner'
import { preprocess } from '../utils.inner'

declare module '@typp/core' {
  namespace t {
    export interface ValidateExtendsEntries<T> {
      number: [
        IsWhat<T, number>, number | Number
      ]
      'literal:number': [
        OnlySubType<T, number>, T & number
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      number: [
        [T] extends [number] ? true : false,
        LiteralTypeGuard<number, T, SwitchBaseType<Input, InputRest, 'number', {
          // TODO infer narrow number
          // `${InputRest & bigint}` extends `${infer T extends number}` ? T : never,
          bigint: number
          boolean: InputRest extends true ? 1 : InputRest extends false ? 0 : never
          number: [InputRest] extends [never] ? (
            Input extends infer UnionInputItem ? (
              IsEqual<UnionInputItem, Number> extends true
                ? number
                : Extract<UnionInputItem, number>
            ) : never
          ) : never
          string: InputRest extends (
            | `${'-' | '+' | ''}${infer O extends number}${string}`
            | '' | 'NaN' | `${'-' | '+' | ''}Infinity`
            | `0${'b' | 'B'}${string}`
            | `0${'o' | 'O'}${number}`
            | `0${'x' | 'X'}${string}`
          ) ? (
            Not<IsWhat<O, never>> extends true
              ? O
              : number
          ) : true extends IsEqual<InputRest, string>
            ? unknown
            : never
          symbol: never
          null: 0
          undefined: 0
        }>>
      ]
    }
  }
}

export const numberTransform: tn.Validator<number>['transform'] = function (input, options) {
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

export function numberValidator(t: typeof tn) {
  t.useValidator([Number], {
    preprocess,
    validate: input => typeof input === 'number',
    transform: numberTransform
  })
}
