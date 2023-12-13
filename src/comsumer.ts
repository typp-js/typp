import { ConstructorMapping, IsEqual, IsNotEqual, Stack, UseWhenNoNever } from './base'
import { ArrayConsume } from './consumers/array'
import { MapConsume } from './consumers/map'
import { ObjectConsume } from './consumers/object'
import { SetConsume } from './consumers/set'
import { t } from '.'

type Consume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<T, ArrayConstructor>
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? (
  ArrayConsume<T, Rest>
) : true extends (
  | IsEqual<T, ObjectConstructor>
  | IsEqual<T, {}>
  | (
    & ([T] extends [Record<string | number | symbol, any>] ? true : false)
    & IsNotEqual<T, ObjectConstructor>
    & ([T] extends [Function] ? false : true)
  )
) ? (
  ObjectConsume<T, Rest>
) : true extends (
  IsEqual<T, MapConstructor>
) ? (
  MapConsume<T, Rest>
) : true extends (
  IsEqual<T, SetConstructor>
) ? (
  SetConsume<T, Rest>
) : never

type PrimitiveMapping<T> = true extends (
  [T] extends [string | number | bigint | boolean | symbol] ? true : false
) ? (
  t.Schema<T, T>
) : true extends (
  IsEqual<null, T>
) ? (
  t.Schema<null, null>
) : true extends (
  IsEqual<undefined, T>
) ? (
  t.Schema<undefined, undefined>
) : true extends (
  IsEqual<void, T>
) ? (
  t.Schema<typeof t.Symbols.void, void>
) : true extends (
  IsEqual<unknown, T>
) ? (
  t.Schema<typeof t.Symbols.unknown, unknown>
) : true extends (
  IsEqual<never, T>
) ? (
  t.Schema<typeof t.Symbols.never, never>
) : never

type InferInstanceType<T> = ConstructorMapping<T> extends infer InferInstanceType
  ? [InferInstanceType] extends [never]
    ? PrimitiveMapping<T>
    : t.Schema<T, InferInstanceType>
  : never

export type Consumer<T extends readonly any[]> =
  Stack.Shift<T> extends [infer L, infer Rest extends any[]]
    ? UseWhenNoNever<
      Consume<L, Rest>,
      InferInstanceType<L>
    >
    : never
