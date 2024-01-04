import type { t, Typp } from '..'
import type { IsEqual } from '../types'

const setSymbol = Symbol('set')
declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      101000: [IsEqual<T, SetConstructor>, SetConsume<T, Rest>]
    }
    export type SetShape<
      S extends t.Schema<any, any>
    > = t.SpecialShape<t.SpecialShapeTypeMapping['set'], S>
    export function map<
      Key, Value extends readonly any[],
      Args extends [key?: Key, ...value: Value]
    >(...args: Args): Typp<[MapConstructor, ...Args]>

    export interface DynamicSpecialShapeTypeMapping {
      readonly set: typeof setSymbol
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping
        .set]: t.Schema<any, any>
    }
  }
}

export type SetConsume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<Rest, []>
  | IsEqual<Rest, readonly []>
) ? (
  t.Schema<
    t.SetShape<t.Schema<any, any>>,
    Set<any>
  >
) : (
  Typp<Rest> extends infer IT extends t.Schema<any, any>
    ? t.Schema<t.SetShape<IT>, Set<t.Infer<IT>>>
    : never
)
