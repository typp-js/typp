import type { t as tn, Typp } from '../base'
import type { IsEqual } from '../types'

const setSymbol = Symbol('set')
declare module '../base' {
  // consumer
  namespace t {
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
  }
  // extend
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

export default function (ctx: typeof tn) {
  const t = ctx
  t.useSpecialShapeType('set', setSymbol)
  t.useConsumer((first, ...rest) => {
    if (first !== Set) return

    return [t.specialShape(
      t.specialShapeTypeMapping.set,
      rest.length === 0 ? t() : t(...rest)
    )]
  })
  t.useStatic('set', (...args) => t(Set, ...args))
}
