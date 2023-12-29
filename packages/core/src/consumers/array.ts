import type { Typp } from '../base'
import { t } from '../base'
import type { IsEqual, IsNotEqual } from '../types'

declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      100000: [true extends (
        | IsEqual<T, ArrayConstructor>
        // empty array or tuple
        | IsEqual<T, []>
        | IsEqual<T, readonly []>
        // tuple
        | (
          & IsNotEqual<T, never>
          & ([T] extends [readonly [any, ...any[]]] ? true : false)
        )
      ) ? true : false, ArrayConsume<T, Rest>]
    }
    export function array<const T extends readonly any[]>(...types: T): Typp<[ArrayConstructor, ...T]>
    export function tuple<const T extends readonly any[]>(...types: T): Typp<[T]>
  }
}
t.defineConsumer((first, ...rest) => {
  if (first === Array) {
    return [[t(...rest)]]
  }
  if (Array.isArray(first)) {
    if (first.length === 0 && rest.length > 0) {
      return [[t(...rest)]]
    }
    return [first.map(item => t(item))]
  }
})
t.defineStatic('array', <const T extends readonly any[]>(...types: T) => t(Array, ...types))
t.defineStatic('tuple', <const T extends readonly any[]>(...types: T) => t(types))

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
