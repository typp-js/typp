import { IsEqual } from './base'
import { Consumer } from './comsumer'

export type Typp<T extends readonly any[]> = true extends (
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? t.Schema<any, any> : Consumer<T>

export function t<const T extends any[]>(...t: T): Typp<T> {
  return {} as Typp<T>
}

const symbols = {
  void: Symbol('void'),
  unknown: Symbol('unknown'),
  never: Symbol('never')
}

t.null = function (): t.Schema<null, null> {
  return {} as t.Schema<null, null>
}
t.void = function (): t.Schema<typeof symbols.void, void> {
  return {} as t.Schema<typeof symbols.void, void>
}

t.literal = t.const = function <
  T extends string | number | boolean | null | undefined | symbol | bigint
>(value: T): t.Schema<typeof value, T> {
  return {} as t.Schema<typeof value, T>
}

export namespace t {
  interface SchemaMeta<Shape, T> {
  }
  export interface Schema<Shape, T> {
    shape: Shape
    meta: SchemaMeta<Shape, T>
  }
  export type Infer<T extends Schema<any, any>> = [T] extends [Schema<any, infer R>] ? R : never
  export declare function infer<T extends Schema<any, any>>(t: T): Infer<T>

  export declare function unknown(): Schema<typeof symbols.unknown, unknown>
  export declare function string(): Schema<StringConstructor, string>
  export declare function number(): Schema<NumberConstructor, number>
  export declare function bigint(): Schema<BigIntConstructor, bigint>
  export declare function symbol(): Schema<SymbolConstructor, symbol>
  export declare function boolean(): Schema<BooleanConstructor, boolean>
  export declare function date(): Schema<DateConstructor, Date>
  export declare function regexp(): Schema<RegExpConstructor, RegExp>
  export declare function undefined(): Schema<undefined, undefined>
  export declare function never(): Schema<typeof symbols.never, never>

  export type Types<T> = T extends infer Item ? Typp<[Item]> : never
  export type Infers<T> = T extends (
    infer Item extends Schema<any, any>
  ) ? Infer<Item> : never
  export declare function union<const T>(t: readonly T[]): Types<T> extends infer Schemas ? (
    Schema<Schemas, Infers<Schemas>>
  ) : never
}

export const typp: typeof t = t
