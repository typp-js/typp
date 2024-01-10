import type { t, Typp } from '../base'
import type { IsEqual, Stack } from '../types'

const mapSymbol = Symbol('map')

declare module '../base' {
  namespace t {
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

export default function (ctx: typeof t) {
  const t = ctx
  t.useSpecialShapeType('map', mapSymbol)
  t.useConsumer((first, ...rest) => {
    if (first !== Map) return

    const [key, ...value] = rest
    return [t.specialShape(t.specialShapeTypeMapping.map, [
      key ? t(key) : t(),
      value.length > 0 ? t(...value) : t()
    ])]
  })
  t.useStatic('map', (...args) => t(Map, ...args))
}
