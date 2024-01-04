import type { Typp } from '..'
import { t } from '../base'
import type { IsEqual, Stack } from '../types'

const mapSymbol = Symbol('map')
declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      111000: [IsEqual<T, MapConstructor>, MapConsume<T, Rest>]
    }
    export type MapShape<
      KSchema extends t.Schema<any, any>,
      VSchema extends t.Schema<any, any>
    > = t.SpecialShape<
      t.SpecialShapeTypeMapping['map'],
      [KSchema, VSchema]
    >
    export function map<
      Key, Value extends readonly any[],
      Args extends [key?: Key, ...value: Value]
    >(...args: Args): Typp<[MapConstructor, ...Args]>

    export interface DynamicSpecialShapeTypeMapping {
      readonly map: typeof mapSymbol
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping
        .map]: [key: t.Schema<any, any>, value: t.Schema<any, any>]
    }
  }
}
t.defineConsumer((first, ...rest) => {
  if (first !== Map) return

  if (rest.length === 0) return [t.specialShape(
    t.specialShapeTypeMapping.map,
    [t(), t()]
  )]
  const [key, ...value] = rest
  // TODO refactor to special shape
  return [t.specialShape(
    t.specialShapeTypeMapping.map,
    [t(key) ?? t(), t(...value) ?? t()]
  )]
})
t.defineStatic('map', (...args) => t(Map, ...args))

export type MapConsume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<Rest, []>
  | IsEqual<Rest, readonly []>
) ? (
  t.Schema<
    t.MapShape<t.Schema<any, any>, t.Schema<any, any>>,
    Map<any, any>
  >
) : (
  Stack.Shift<Rest> extends [
    infer L,
    infer Rest extends any[]
  ] ? (
    [Typp<[L]>, Typp<Rest>] extends [
      infer KT extends t.Schema<any, any>,
      infer VT extends t.Schema<any, any>
    ] ? t.Schema<t.MapShape<KT, VT>, Map<t.Infer<KT>, t.Infer<VT>>>
      : never
  ) : never
)
