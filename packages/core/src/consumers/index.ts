import type { t } from '../base'
import type { IsEqual, IsNotEqual, Stack, UseWhenNoNever } from '../types'
import type { ArrayConsume } from './array'
import type { FunctionConsume } from './function'
import type { MapConsume } from './map'
import type { ObjectConsume } from './object'
import type { PrimitiveMapping } from './primitive'
import type { SetConsume } from './set'

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
    & ([T] extends [t.Schema<any, any>] ? false : true)
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
> = Stack.Shift<T> extends [infer L, infer Rest extends any[]]
  // TODO simplify code
  ? UseWhenNoNever<
      // TODO SpecialShapeMapping
      InferSpecialShape<L>,
      UseWhenNoNever<
        // TODO ShapeMapping
        // TODO merge SpecialShapeMapping and ShapeMapping
        Consume<L, Rest>,
        UseWhenNoNever<
          PrimitiveMapping<L>,
          [L] extends [t.Schema<any, any>] ? L : never
        >
      >
    >
  : never

export * from './array'
export * from './calc'
export * from './function'
export * from './map'
export * from './object'
export * from './primitive'
export * from './set'
