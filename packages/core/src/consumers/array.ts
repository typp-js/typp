import type { t, Typp } from '../base'
import type { IsEqual, IsNotEqual } from '../types'

declare module '../base' {
  namespace t {
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

export default function (ctx: typeof t) {
  const typp = ctx
  ctx.defineConsumer((first, ...rest) => {
    if (first === Array) {
      return [[typp(...rest)]]
    }
    if (Array.isArray(first)) {
      if (first.length === 0 && rest.length > 0) {
        return [[typp(...rest)]]
      }
      return [first.map(item => typp(item))]
    }
  })
  ctx.defineStatic('array', <const T extends readonly any[]>(...types: T) => typp(Array, ...types))
  ctx.defineStatic('tuple', <const T extends readonly any[]>(...types: T) => typp(types))
}
