import type { Typp } from '..'
import { t } from '../base'
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
    export function set<
      Value extends readonly any[]
    >(...item: Value): Typp<[SetConstructor, ...Value]>

    export interface DynamicSpecialShapeTypeMapping {
      readonly set: typeof setSymbol
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping
        .set]: t.Schema<any, any>
    }
  }
}
t.defineSpecialShapeType('set', setSymbol)
t.defineConsumer((first, ...rest) => {
  if (first !== Set) return

  return [t.specialShape(
    t.specialShapeTypeMapping.set,
    rest.length === 0 ? t() : t(...rest)
  )]
})
t.defineStatic('set', (...args) => t(Set, ...args))

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
