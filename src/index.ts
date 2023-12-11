import type { ConstructorMapping, IsEqual, IsNotEqual } from './base'

namespace Stack {
  export type Pop<T extends readonly any[]> =
    T extends [...infer Rest, infer R]
      ? [R, Rest]
      : never
  export type Shift<T extends readonly any[]> =
    T extends [infer L, ...infer Rest]
      ? [L, Rest]
      : never
  export type Push<T extends readonly any[], V> =
    [...T, V]
}

type Consume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<T, ArrayConstructor>
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? (
  true extends (
    & (
      | IsEqual<Rest, []>
      | IsEqual<Rest, readonly []>
    )
    & (
      | IsEqual<T, []>
      | IsEqual<T, readonly []>
    )
  ) ? t.Schema<[], []>
    : t.Schema<
      Typp<Rest>[],
      t.Infer<Typp<Rest>>[]
    >
) : true extends (
  | IsEqual<T, ObjectConstructor>
  | IsEqual<T, {}>
  | (
    & ([T] extends [Record<string | number | symbol, any>] ? true : false)
    & IsNotEqual<T, ObjectConstructor>
    & ([T] extends [Function] ? false : true)
  )
) ? (
  true extends (
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
) : never

type InferInstanceType<T> = ConstructorMapping<T> extends infer InferInstanceType
  ? [InferInstanceType] extends [never]
    ? never
    : t.Schema<T, InferInstanceType>
  : never

type Typp<T extends readonly any[]> = true extends (
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? t.Schema<any, any>
  : (
    Stack.Shift<T> extends [infer L, infer Rest extends any[]]
      ? Consume<L, Rest> extends (infer R)
        ? [R] extends [never]
          ? InferInstanceType<L>
          : R
        : never
      : never
  )

export function t<const T extends any[]>(...t: T): Typp<T> {
  return {} as Typp<T>
}

export const typp: typeof t = t

export namespace t {
  export interface Schema<Shape, T> {
    shape: Shape
    type: T
  }
  export type Infer<T extends Schema<any, any>> = [T] extends [Schema<any, infer R>] ? R : never
  export declare function infer<T extends Schema<any, any>>(t: T): Infer<T>
}
