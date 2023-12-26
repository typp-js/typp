import type { t, Typp } from '..'
import type { IsEqual, IsNotEqual, Stack } from '../types'

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
            & ([T] extends [t.Schema<any, any>] ? false : true)
          )
        )
      ) ? true : false, ObjectConsume<T, Rest>]
    }
  }
}

export type ObjectConsume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<Rest, []>
  | IsEqual<Rest, readonly []>
) ? (
  true extends IsEqual<T, {}> ? (
    t.Schema<{}, {}>
  ) : true extends IsEqual<T, ObjectConstructor> ? (
    t.Schema<{
      [k: string | number | symbol]: t.Schema<any, any>
    }, {
      [k: string | number | symbol]: any
    }>
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
