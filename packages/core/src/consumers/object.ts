import { IsEqual, Stack } from '../types'
import { t, Typp } from '..'

declare module '..' {
  namespace t {
    // TODO keyof
    // TODO omit
    // TODO pick
    // TODO partial
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
    {
      -readonly [K in keyof T]: [T[K]] extends [t.Schema<any, any>]
        ? T[K]
        : Typp<[T[K]]>
    } extends infer R ? (
      t.Schema<R, {
        [K in keyof R]: [R[K]] extends [t.Schema<any, any>]
          ? t.Infer<R[K]>
          // TODO maybe should return `R[K]`?
          : never
      }>
    ) : never
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
