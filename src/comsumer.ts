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

type InferInstanceType<T> = ConstructorMapping<T> extends infer InferInstanceType
  ? [InferInstanceType] extends [never]
    ? never
    : t.Schema<T, InferInstanceType>
  : never

export type Consumer<T extends readonly any[]> =
  Stack.Shift<T> extends [infer L, infer Rest extends any[]]
    ? UseWhenNoNever<
      Consume<L, Rest>,
      InferInstanceType<L>
    >
    : never
