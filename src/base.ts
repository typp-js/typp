export type IsEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false

export type IsNotEqual<A, B> = IsEqual<A, B> extends true ? false : true

export type Includes<
  T extends readonly any[],
  U extends readonly any[]
> = T extends readonly [infer L, ...infer R]
  ? L extends U[number] ? Includes<R, U> : false
  : true

export type IsSameTuple<
  T extends readonly any[],
  U extends readonly any[]
> = Includes<T, U> extends true ? Includes<U, T> : false

export type U2I<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
export type T2I<T extends readonly any[]> = T extends [infer L, ...infer R]
  ? L & T2I<R> : unknown

/**
 * LastInUnion<1 | 2> = 2.
 */
type LastInUnion<U> = U2I<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never

type U2T_Exclude<T,U> = T extends U ? (<A>() => (A extends T ? 1 : 2)) extends (<A>() => (A extends U ? 1 : 2)) ? never : T : T
/**
 * U2T<1 | 2> = [1, 2].
 */
export type U2T<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...U2T<U2T_Exclude<U, Last>>, Last]

export type IsUnion<T, U = T> = T extends U ? ([U] extends [T] ? false : true) : false

export type Concats<T extends readonly any[]> = T extends readonly [infer L, ...infer R]
  ? L extends readonly any[] ? [...L, ...Concats<R>] : []
  : []

export type ULength<U> = U2T<U>['length']

export type Collect<T, U> = IsUnion<T> extends true ? (
  Concats<U2T<
    T extends infer Item ? Collect<Item, U> : []
  >>
) : [T] extends [U] ? (
  [T]
) : true extends (
  | IsEqual<T, []>
) ? (
  []
) : [T] extends [[
  infer L, ...infer R
]] ? (
  [L] extends [U]
    ? [...Collect<L, U>, ...Collect<R, U>]
    : [R] extends [[]]
      ? Collect<L, U>
      : Collect<R, U>
) : [T] extends [Record<string | symbol | number, any>] ? (
  true extends (
    | IsEqual<T, {}>
  ) ? [] : (
    Concats<U2T<
      keyof T extends infer Keys ? (
        Keys extends infer K extends keyof T
          ? Collect<T[K], U>
          : []
      ) : never
    >>
  )
) : (
  []
)

type ReplaceFinder<T, U extends readonly [any, any][]> = U extends [
  infer L extends [any, any],
  ...infer R extends readonly [any, any][]
] ? (
  T extends L[0] ? L[1] : ReplaceFinder<T, R>
) : T
// //   _?
// type R0 = ReplaceFinder<'a', [['a', '1']]>
// //   _?
// type R1 = ReplaceFinder<'a' | 'b' | 'd', [
//   [1, '1'],
//   [2, true],
//   ['d', 'e']
// ]>

export type Replace<
  T,
  U extends readonly [any, any][],
> = IsUnion<T> extends true ? (
  T extends infer Item ? Replace<Item, U> : never
) : [T] extends [U[number][0]] ? (
  ReplaceFinder<T, U>
) : true extends (
  | IsEqual<T, []>
) ? (
  []
) : [T] extends [[
  infer L, ...infer R
]] ? (
  [Replace<L, U>, ...Replace<R, U>]
) : [T] extends [Record<string | symbol | number, any>] ? (
  true extends (
    | IsEqual<T, {}>
  ) ? never : (
    {
      [
        K in keyof T
          // TODO support replace in key
          // as ReplaceFinder<keyof T, U>
      ]: Replace<T[K], U>
    }
  )
) : (
  T
)

type Cast<A, B> = A extends B ? A : B

type Primitive = string | number | boolean | bigint | symbol | undefined | null

export type Narrow<T> = Cast<T, unknown[] | [] | (T extends Primitive ? T : never) | ({
  [K in keyof T]: K extends typeof Symbol.species
    ? T[K]
    : Narrow<T[K]>
})>

export type ValueOf<T> = T[keyof T]

export type UseWhenNoNever<T, U = never> = [T] extends [never] ? U : T

export namespace Stack {
  export type Pop<T extends readonly any[]> =
    T extends readonly [...infer Rest, infer R]
      ? [R, Rest]
      : [never, never]
  export type Shift<T extends readonly any[]> =
    T extends readonly [infer L, ...infer Rest]
      ? [L, Rest]
      : [never, never]
  export type Push<T extends readonly any[], V> =
    [...T, V]
}

interface ConstructorEntries<
  A = any, B = any, C = any, D = any, E = any
> {
  1000: [StringConstructor, string]
  1001: [NumberConstructor, number]
  1002: [BooleanConstructor, boolean]
  1003: [DateConstructor, Date]
  1004: [RegExpConstructor, RegExp]
  1005: [ArrayConstructor, Array<A>]

  1006: [MapConstructor, Map<A, B>]
  1007: [SetConstructor, Set<A>]
  1016: [WeakMapConstructor, A extends WeakKey ? WeakMap<A, B> : never]
  1017: [WeakSetConstructor, A extends WeakKey ? WeakSet<A> : never]

  1009: [FunctionConstructor, A extends any[] ? (...args: A) => B : never]
  1010: [PromiseConstructor, Promise<A>]
  1011: [SymbolConstructor, symbol]
  1012: [BigIntConstructor, bigint]
  1013: [ErrorConstructor, Error]
  1014: [PromiseConstructor, Promise<A>]
  [key: number]: [Function, any]
}

export type ConstructorMapping<
  T,
  A = any, B = any, C = any, D = any, E = any,
  Entries extends ConstructorEntries<A, B, C> = ConstructorEntries<A, B, C>
> = ValueOf<{
  [
    K
      in keyof Entries
      as IsEqual<
        // @ts-ignore
        Entries[K][0],
        T
      > extends true ? number : never
  ]: Entries[K & number][1]
}>
