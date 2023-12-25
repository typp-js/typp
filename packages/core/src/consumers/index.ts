import type { t } from '../base'
import type { IsEqual, Stack, UseWhenNoNever, ValueOf } from '../types'
import type { PrimitiveMapping } from './primitive'

declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      [key: number & {}]: [boolean, t.Schema<any, any>]
    }
  }
}

type ShapeMapping<
  T, Rest extends any[],
  Entries extends t.ShapeEntries<T, Rest> = t.ShapeEntries<T, Rest>
> = ValueOf<{
  [ K in keyof Entries
      as true extends (
        IsEqual<Entries[K & number][0], true>
      ) ? K : never
  ]: Entries[K & number][1]
}>

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
        ShapeMapping<L, Rest>,
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
