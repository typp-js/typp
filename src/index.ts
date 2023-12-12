import { ConstructorMapping, IsEqual, IsNotEqual, Stack, UseWhenNoNever } from './base'
import { ArrayConsume } from './consumers/array'
import { MapConsume } from './consumers/map'
import { ObjectConsume } from './consumers/object'
import { SetConsume } from './consumers/set'

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

type Consumer<T extends readonly any[]> =
  Stack.Shift<T> extends [infer L, infer Rest extends any[]]
    ? UseWhenNoNever<
      Consume<L, Rest>,
      InferInstanceType<L>
    >
    : never

type InferInstanceType<T> = ConstructorMapping<T> extends infer InferInstanceType
  ? [InferInstanceType] extends [never]
    ? never
    : t.Schema<T, InferInstanceType>
  : never

export type Typp<T extends readonly any[]> = true extends (
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? t.Schema<any, any> : Consumer<T>

export function t<const T extends any[]>(...t: T): Typp<T> {
  return {} as Typp<T>
}

export const typp: typeof t = t

export namespace t {
  export interface Schema<Shape, T> {
    shape: Shape
    type: T
  }
  export type Infer<T extends Schema<any, any>> = [T] extends [Schema<any, infer R>] ? R : never
  export declare function infer<T extends Schema<any, any>>(t: T): Infer<T>
}
