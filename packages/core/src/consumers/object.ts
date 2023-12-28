import type { Typp } from '..'
import { t } from '..'
import type { IsEqual, IsNotEqual, Stack } from '../types'

const recordSymbol = Symbol('record')
declare module '../base' {
  namespace t {
    // TODO keyof
    // TODO omit
    // TODO pick
    // TODO partial
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
  }
}

t.defineConsumer((first, ...rest) => {
  if (
    t.isSchema(first)
    || typeof first === 'function'
    || typeof first === 'symbol'
    || Array.isArray(first)
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
    // t(Object, String)
    // t({}, String)
    // t(Object, String, Number)
    // t({}, String, Number)
    if (isObjectConstructor || isEmptyObject) {
      const [key, ...valueRest] = rest
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
  Stack.Shift<Rest> extends [
    infer L extends StringConstructor | NumberConstructor | SymbolConstructor,
    infer Rest extends any[]
  ] ? (
    // @ts-ignore
    t.Infer<Typp<[L]>> extends (
      infer Keys extends string | number | symbol
    ) ? t.Schema<{
        // TODO union
        [k in Keys]: Typp<Rest>
      }, {
        // TODO union
        [k in Keys]: t.Infer<Typp<Rest>>
      }>
      : never
  ) : never
)
