import { ConstructorMapping, IsEqual, IsNotEqual, Stack, UseWhenNoNever } from './types'
import { ArrayConsume } from './consumers/array'
import { FunctionConsume } from './consumers/function'
import { MapConsume } from './consumers/map'
import { ObjectConsume } from './consumers/object'
import { SetConsume } from './consumers/set'
import { PrimitiveMapping } from './consumers/primitive'
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
) : true extends (
  IsEqual<T, FunctionConstructor>
) ? (
  FunctionConsume<T, Rest>
) : never

type InferInstanceType<T> = ConstructorMapping<T> extends infer InferInstanceType
  ? [InferInstanceType] extends [never]
    ? PrimitiveMapping<T>
    : t.Schema<T, InferInstanceType>
  : never

type InferSpecialShape<
  T,
  Rest extends any[] = []
> = [T] extends [
  t.SpecialShape<t.SpecialShapeTypes, any>
] ? (
  true extends (
    IsEqual<T['type'], t.SpecialShapeTypeMapping['union']>
  ) ? (
    // TODO no `t.InferT`?
    t.Union<t.InferT<T['schemas']>>
  ) : true extends (
    IsEqual<T['type'], t.SpecialShapeTypeMapping['intersection']>
  ) ? (
    t.Intersect<T['schemas']>
  ) : true extends (
    IsEqual<T['type'], t.SpecialShapeTypeMapping['generic']>
  ) ? (
    t.GenericSchema<T['schemas']>
  ) : never
) : never

export type Consumer<
  T extends readonly any[]
> =
  Stack.Shift<T> extends [infer L, infer Rest extends any[]]
    ? UseWhenNoNever<
        InferSpecialShape<L>,
        UseWhenNoNever<
          Consume<L, Rest>,
          InferInstanceType<L>
        >
      >
    : never
