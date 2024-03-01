import type {
  IsAnySubType,
  IsEqual, IsSubType,
  IsTrue,
  IsWhat,
  Switch,
  SwitchEntries,
  SwitchOtherEntry,
  t as tn
} from '@typp/core'

import { toPrimitive } from './utils'

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
  : [InputRest] extends [never]
    ? never
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
  null: IsAnySubTypeWithSelfName<
    'null',
    SelfName, Input, InputRest,
    null
  >
  undefined: IsAnySubTypeWithSelfName<
    'undefined',
    SelfName, Input, InputRest,
    undefined
  >
}
type BaseTypesTransformers = {
  [K in BaseTypeNames]: unknown
}
export declare const neverReturn: unique symbol
export type SwitchBaseType<
  Input,
  InputRest,
  SelfName extends BaseTypeNames,
  Transformers extends BaseTypesTransformers,
  Other = never,
  Entries extends SwitchEntries =
    & {
      [K in BaseTypeNames]: [
        IsTargetBaseTypeName<SelfName, Input, InputRest>[K],
        Transformers[K]
      ]
    }
    & { [K in SwitchOtherEntry]: Other }
> = Switch<{
  any: [IsEqual<Input, any>, any]

  never: [IsEqual<Input, never>, typeof neverReturn]
  unknown: [IsEqual<Input, unknown>, unknown]
}> extends infer R
  ? IsEqual<R, never> extends true
    ? Switch<Entries>
    : IsEqual<R, typeof neverReturn> extends true
      ? never
      : R
  : never

export type LiteralTypeGuard<BaseType, T, Result> = IsWhat<T, BaseType> extends true
  ? Result : (
    IsTrue<IsSubType<Result, T>> extends true
      ? Result
      : never
  )

export class ValidateError extends Error {
  __TYPP_SYMBOL__ = '__ValidateError__'
  constructor(
    public type: string,
    public expected: tn.Schema<any, any>,
    public actual: any
  ) {
    super(`Data is ${type}`)
    this.name = 'ValidateError'
  }
}

export class ParseError extends Error {
  __TYPP_SYMBOL__ = '__ParseError__'
  constructor(
    public step: string,
    public expected: tn.Schema<any, any>,
    public actual: any,
    public detail: Error
  ) {
    let actualStr = ''
    try {
      actualStr = JSON.stringify(actual)
    } catch {
      actualStr = String(toPrimitive(actual))
    }
    super(`Data \`${actualStr}\` cannot be parsed at \`${step}\`, because ${detail.message}`)
    this.name = 'ParseError'
  }
}
