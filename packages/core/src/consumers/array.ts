import type { Typp } from '..'
import { t } from '../base'
import type { IsEqual, Pretty } from '../types'

declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      100000: [true extends (
        | IsEqual<T, ArrayConstructor>
        // empty array or tuple
        | IsEqual<T, []>
        | IsEqual<T, readonly []>
        // tuple
        | ([T] extends [readonly [any, ...any[]]] ? true : false)
      ) ? true : false, ArrayConsume<T, Rest>]
    }
    export function array<const T extends readonly any[]>(...types: T): Typp<[ArrayConstructor, ...T]>
    export function tuple<const T extends readonly any[]>(...types: T): Typp<[T]>
  }
}
t.defineStatic('array', <T extends readonly any[]>() => <Typp<[ArrayConstructor, ...T]>>({}))
t.defineStatic('tuple', <T extends readonly any[]>() => <Typp<[T]>>({}))

export type ArrayConsume<
  T,
  Rest extends any[]
> = true extends (
  & (
    | IsEqual<Rest, []>
    | IsEqual<Rest, readonly []>
  )
  & (
    | IsEqual<T, []>
    | IsEqual<T, readonly []>
  )
) ? (
  t.Schema<[], []>
) : true extends (
  ([T] extends [readonly [any, ...any[]]] ? true : false)
) ? (
  [t.TyppI<T>] extends [infer R] ? t.Schema<R, t.InferI<R>> : never
) : t.Schema<Typp<Rest>[], t.Infer<Typp<Rest>>[]>
