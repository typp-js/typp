import type { IsAnySubType, IsEqual, IsSubType, IsWhat, Switch, t as tn } from '@typp/core'

import { FALSY } from '../base'
import { preprocess } from '../utils.inner'

type BaseTypeNames =
  | 'bigint'
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'null'
  | 'undefined'
type IsAnySubTypeWithSelfName<Key, SelfName extends BaseTypeNames, Input, InputRest, SubType> = IsWhat<Key, SelfName> extends true
  ? IsAnySubType<Input, SubType>
  : IsAnySubType<InputRest, SubType>
interface IsTargetBaseTypeName<SelfName extends BaseTypeNames, Input, InputRest> {
  bigint: IsAnySubTypeWithSelfName<
    'bigint',
    SelfName, Input, InputRest,
    bigint | BigInt
  >
  boolean: IsAnySubTypeWithSelfName<
    'boolean',
    SelfName, Input, InputRest,
    boolean | Boolean
  >
  number: IsAnySubTypeWithSelfName<
    'number',
    SelfName, Input, InputRest,
    number | Number
  >
  string: IsAnySubTypeWithSelfName<
    'string',
    SelfName, Input, InputRest,
    string | String
  >
  symbol: IsAnySubTypeWithSelfName<
    'symbol',
    SelfName, Input, InputRest,
    symbol | Symbol
  >
  null: IsSubType<InputRest, null>
  undefined: IsSubType<InputRest, undefined>
}
type BaseTypesTransformers = {
  [K in BaseTypeNames]: unknown
}
declare const anyReturn: unique symbol
declare const neverReturn: unique symbol
type SwitchBaseType<
  Input,
  InputRest,
  SelfName extends BaseTypeNames,
  Transformers extends BaseTypesTransformers,
  Entries extends { [k: string]: [boolean, any] } = {
    [K in BaseTypeNames]: [
      IsTargetBaseTypeName<SelfName, Input, InputRest>[K],
      Transformers[K]
    ]
  }
> = Switch<{
  any: [IsEqual<Input, any>, typeof anyReturn]

  never: [IsEqual<Input, never>, typeof neverReturn]
  unknown: [IsEqual<Input, unknown>, unknown]
}> extends infer R
  ? IsWhat<R, never> extends true
    ? Switch<Entries>
    : IsWhat<R, typeof neverReturn> extends true
      ? never
      : IsWhat<R, typeof anyReturn> extends true
        ? any
        : never
  : never

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
        SwitchBaseType<Input, InputRest, 'number', {
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
            // TODO infer narrow number
            // | `${infer T extends number}${string}`
            | `${number}${string}`
            | `0${'b' | 'B'}${string}`
            | `0${'o' | 'O'}${number}`
            | `0${'x' | 'X'}${string}`
          ) ? number
            : true extends IsEqual<InputRest, string>
              ? unknown
              : never
          symbol: never
          null: 0
          undefined: 0
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
