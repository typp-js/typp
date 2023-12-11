import type { ConstructorMapping, IsEqual } from './base'

namespace Stack {
  export type Pop<T extends any[]> =
    T extends [...infer Rest, infer R]
      ? [R, Rest]
      : never
  export type Shift<T extends any[]> =
    T extends [infer L, ...infer Rest]
      ? [L, Rest]
      : never
  export type Push<T extends any[], V> =
    [...T, V]
}

type Consume<
  T,
  Rest extends any[]
> = IsEqual<T, ArrayConstructor> extends true ? (
  t.Schema<
    Typp<Rest>[],
    t.Infer<Typp<Rest>>[]
  >
) : IsEqual<T, ObjectConstructor> extends true ? (
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
) : never

type Typp<T extends any[]> = IsEqual<T, []> extends true
  ? any
  : (
    Stack.Shift<T> extends [infer L, infer Rest extends any[]]
      ? ConstructorEntries<L, Rest> extends (infer R)
        ? [R] extends [never]
          ? t.Schema<L, ConstructorMapping<L>>
          : R
        : never
      : never
  )

// &./index.spec.ts:5:7?
// &./index.spec.ts:10:7?
// &./index.spec.ts:11:7?
// &./index.spec.ts:12:7?

export function t<T extends any[]>(...t: T): Typp<T> {
  return {} as Typp<T>
}

export const typp: typeof t = t

export namespace t {
  export interface Schema<Shape, T> {
    shape: Shape
    type: T
  }
  export type Infer<T extends Schema<any, any>> = T extends Schema<any, infer R> ? R : never
  export declare function infer<T extends Schema<any, any>>(t: T): Infer<T>
}
