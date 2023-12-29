import type { Typp } from '../base'
import { t } from '../base'
import type { IsEqual, IsNotEqual, Stack } from '../types'

const recordSymbol = Symbol('record')
declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      110000: [true extends (
        // exclude array
        & (T extends { type: t.SpecialShapeTypes } ? false : true)
        // exclude array
        & IsNotEqual<T, ArrayConstructor>
        // exclude empty array or tuple
        & IsNotEqual<T, []>
        & IsNotEqual<T, readonly []>
        // exclude tuple
        & ([T] extends [readonly [any, ...any[]]] ? false : true)
        & (
          | IsEqual<T, ObjectConstructor>
          | IsEqual<T, {}>
          | (
            & ([T] extends [Record<string | number | symbol, any>] ? true : false)
            & IsNotEqual<T, ObjectConstructor>
            & ([T] extends [Function] ? false : true)
            // TODO maybe remove next line
            & ([T] extends [t.Schema<any, any>] ? false : true)
          )
        )
      ) ? true : false, ObjectConsume<T, Rest>]
    }
    export interface DynamicSpecialShapeTypeMapping {
      readonly record: typeof recordSymbol
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping
        .record]: [keys: readonly t.Schema<any, any>[], value: t.Schema<any, any>]
    }
    // TODO keyof
    // TODO omit
    // TODO pick
    // TODO partial

    // TODO record
    // record() => { [k: string | number | symbol]: any }
    // record(String) => { [k: string]: any }
    // record(String, Number) => { [k: string]: number }
    export function record<const T extends readonly any[]>(...types: T): Typp<[ObjectConstructor, ...T]>
    // TODO object
    // object() => {}
    // object(String) => { [k: string]: any }
    // object(String, Number) => { [k: string]: number }
    export function object<const T extends readonly any[]>(...types: T): Typp<[{}, ...T]>
    // TODO interface
    // TODO class
  }
}
t.defineSpecialShapeType('record', recordSymbol)

t.defineConsumer((first, ...rest) => {
  if (
    (typeof first !== 'object' && first !== Object)
    // TODO extensible
    || t.isSpecialShape(first)
    || t.isSchema(first)
    || Array.isArray(first)
    // TODO Promise like
  ) return
  const isEmptyObject = Object.keys(first).length === 0
  const isObjectConstructor = first === Object
  if (rest.length === 0) {
    // t(Object)
    if (isObjectConstructor) return [t.specialShape(recordSymbol, [
      [t(String), t(Number), t(Symbol)], t()
    ])]
    // t({})
    if (isEmptyObject) return [{}]
  } else {
    // t({} | ObjectConstructor, [key: string | number | symbol, value: ...any[]])
    if (isObjectConstructor || isEmptyObject) {
      const [key, ...valueRest] = rest
      // TODO check key is `string | number | symbol`, if not, throw error
      return [t.specialShape(recordSymbol, [
        [t(key)], t(...valueRest)
      ])]
    }
  }
  // t({ a: String, b: Number })
  if (!isEmptyObject) return [Object.entries(first).reduce((acc, [k, v]) => ({
    ...acc,
    [k]: t(v)
  }), {})]
})

export type ObjectConsume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<Rest, []>
  | IsEqual<Rest, readonly []>
) ? (
  // ObjectConsume<{}, []>
  true extends IsEqual<T, {}> ? (
    t.Schema<{}, {}>
  // ObjectConsume<ObjectConstructor, []>
  ) : true extends IsEqual<T, ObjectConstructor> ? (
    t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
      [
        t.Schema<StringConstructor, string>,
        t.Schema<NumberConstructor, number>,
        t.Schema<SymbolConstructor, symbol>,
      ],
      t.Schema<any, any>
    ]>, {
      [k: string | number | symbol]: any
    }>
  // ObjectConsume<{ a: String, b: Number }, []>
  ) : [T] extends [Record<string | number | symbol, any>] ? (
    [t.TyppI<T>] extends [infer R] ? t.Schema<R, t.InferI<R>> : never
  ) : never
) : (
  // ObjectConsume<{} | ObjectConstructor, [key: string | number | symbol, value: ...any[]]>
  Stack.Shift<Rest> extends [
    infer L, infer Rest extends any[]
  ] ? (
    Typp<[L]> extends (
      infer KeySchema extends t.Schema<any, any>
    ) ? t.Infer<KeySchema> extends (
      infer Key extends string | number | symbol
    ) ? t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
        [KeySchema], Typp<Rest>
      ]>, {
        [k in Key]: t.Infer<Typp<Rest>>
      }>
      : never
      : never
  ) : never
)
