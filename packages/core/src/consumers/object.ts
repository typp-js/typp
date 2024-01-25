import type { t as tn, Typp } from '../base'
import type { IsEqual, IsNotEqual, Stack, Values } from '../types'

const recordSymbol = Symbol('record')

declare module '../base' {
  namespace t {
    export type ObjectConsume<
      T,
      Rest extends any[]
    > = true extends (
      | IsEqual<Rest, []>
      | IsEqual<Rest, readonly []>
      | (
        & IsNotEqual<T, ObjectConstructor>
        & IsNotEqual<T, {}>
      )
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
          [k: PropertyKey]: any
        }>
      // ObjectConsume<{ a: String, b: Number }, []>
      ) : [T] extends [Record<PropertyKey, any>] ? (
        [t.TyppI<T>] extends [infer R] ? t.Schema<R, t.InferI<R>> : never
      ) : never
    ) : (
      // ObjectConsume<{} | ObjectConstructor, [key: PropertyKey, value: ...any[]]>
      Stack.Shift<Rest> extends [
        infer L, infer Rest extends any[]
      ] ? (
        Typp<[L]> extends (
          infer KeySchema extends t.Schema<any, any>
        ) ? t.Infer<KeySchema> extends (
          infer Key extends PropertyKey
        ) ? t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
            [KeySchema], Typp<Rest>
          ]>, {
            [k in Key]: t.Infer<Typp<Rest>>
          }>
          : never
          : never
      ) : never
    )
    // TODO unit test
    export interface ObjectExcludeShapes {
    }
    export interface ShapeEntries<T, Rest extends any[]> {
      110000: [true extends (
        // exclude specialShape
        & (T extends { type: t.SpecialShapeTypes } ? false : true)
        // exclude ObjectExcludeShapes
        & (T extends Values<ObjectExcludeShapes> ? false : true)
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
            & ([T] extends [Record<PropertyKey, any>] ? true : false)
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
    // record() => { [k: PropertyKey]: any }
    // record(String) => { [k: string]: any }
    // record(String, Number) => { [k: string]: number }
    export function record<const T extends readonly any[]>(...types: T): Typp<[ObjectConstructor, ...T]>
    // TODO object
    // object()/object({}) => {}
    // object(String) => { [k: string]: any }
    // object(String, Number) => { [k: string]: number }
    // object({ a: String, b: Number }) => { a: string, b: number }
    export function object<const T extends readonly any[]>(...types: T): Typp<[{}, ...T]>
    // TODO interface
    // interface()/interface({}) => {}
    // interface({ a: String, b: Number }) => { a: string, b: number }
    // TODO generic support of interface
    // TODO class
    // class(class { a = String, b = Number }) => { a: string, b: number }
    // class(class This { label = String, children = array(This) }) => { label: string, children: This[] }
  }
}

export default function (ctx: typeof tn) {
  const t = ctx
  t.useSpecialShapeType('record', recordSymbol)

  t.useConsumer((first, ...rest) => {
    if (
      (typeof first !== 'object' && first !== Object)
      || first === null
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
      // t({} | ObjectConstructor, [key: PropertyKey, value: ...any[]])
      if (isObjectConstructor || isEmptyObject) {
        const [key, ...valueRest] = rest
        // TODO check key is `PropertyKey`, if not, throw error
        return [t.specialShape(recordSymbol, [
          [t(key)], t(...valueRest)
        ])]
      }
    }
    // t(Object | { a: String, b: Number })
    // t(Object | { a: String, b: Number }, [key: PropertyKey, value: ...any[]])
    return [Object.entries(first).reduce((acc, [k, v]) => ({
      ...acc,
      [k]: t(v)
    }), {})]
  })
}
