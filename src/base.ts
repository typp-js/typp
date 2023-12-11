export type IsEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false

export type ValueOf<T> = T[keyof T]
  
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

  1008: [ObjectConstructor, A]
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
