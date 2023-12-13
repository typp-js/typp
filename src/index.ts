import { IsEqual, T2I } from './base'
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

t.literal = t.const = literal
function literal<
  T extends string | number | bigint | symbol | null | boolean | undefined,
  WrapT = [T] extends [string]
    ? JoinLiteral<SplitLiteral<T>>
    : T
>(value: T): t.Schema<WrapT, WrapT> {
  return {} as t.Schema<WrapT, WrapT>
}
type LiteralPlaceholder<T extends string = string> = `__DO_NOT_USE_SAME_LITERAL_${T}__IF_YOU_WANT_TO_USE_IT__`
literal.String = `__DO_NOT_USE_SAME_LITERAL_${
  'STRING'
}__IF_YOU_WANT_TO_USE_IT__` as const
literal.Number = `__DO_NOT_USE_SAME_LITERAL_${
  'NUMBER'
}__IF_YOU_WANT_TO_USE_IT__` as const
literal.BigInt = `__DO_NOT_USE_SAME_LITERAL_${
  'BIGINT'
}__IF_YOU_WANT_TO_USE_IT__` as const
literal.Null = `__DO_NOT_USE_SAME_LITERAL_${
  'NULL'
}__IF_YOU_WANT_TO_USE_IT__` as const
literal.Boolean = `__DO_NOT_USE_SAME_LITERAL_${
  'BOOLEAN'
}__IF_YOU_WANT_TO_USE_IT__` as const
literal.Undefined = `__DO_NOT_USE_SAME_LITERAL_${
  'UNDEFINED'
}__IF_YOU_WANT_TO_USE_IT__` as const
interface LiteralStringMapping {
  STRING: string
  NUMBER: number
  BIGINT: bigint
  NULL: null
  BOOLEAN: boolean
  UNDEFINED: undefined
}
type SplitLiteral<T extends string> = string extends T
  ? string[]
  : T extends ''
    ? []
    : T extends `${infer L}${LiteralPlaceholder}${infer R}`
      ? T extends `${L}${infer S}${R}`
        ? S extends LiteralPlaceholder<infer S extends keyof LiteralStringMapping>
          ? [L, LiteralStringMapping[S], ...SplitLiteral<R>]
          : never
        : [T]
      : [T]
type T0 = SplitLiteral<'any'>
//   ^?
type JoinLiteral<T extends readonly any[]> = T extends readonly [
  infer L extends LiteralStringMapping[keyof LiteralStringMapping],
  infer R extends LiteralStringMapping[keyof LiteralStringMapping],
  ...infer Rest
] ? `${L}${R}${JoinLiteral<Rest>}`
  : T extends readonly [infer L]
    ? L extends string ? L : never
    : ''

export namespace t {
  interface SchemaMeta<Shape, T> {
  }
  export interface Schema<Shape, T> {
    shape: Shape
    meta: SchemaMeta<Shape, T>
  }
  export type Infer<T extends Schema<any, any>> = [T] extends [Schema<any, infer R>] ? R : never
  export declare function infer<T extends Schema<any, any>>(t: T): Infer<T>

  /**
   * rename and export to user
   */
  export const Symbols = symbols
  export declare function any(): Schema<any, any>
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

  export type TypeT<T extends readonly any[]> = T extends readonly [
    infer Item, ...infer Rest extends any[]
  ] ? (
    [
      Item extends Schema<any, any> ? Item : Typp<[Item]>,
      ...TypeT<Rest>
    ]
  ) : []
  export type InferT<T extends readonly Schema<any, any>[]> = T extends [
    infer Item extends Schema<any, any>,
    ...infer Rest extends readonly Schema<any, any>[]
  ] ? (
    [Infer<Item>, ...InferT<Rest>]
  ) : []
  export declare function union<const T>(t: readonly T[]): Types<T> extends infer Schemas ? (
    [Schemas] extends [never]
      ? Schema<typeof symbols.never, never>
      : Schema<Schemas, Infers<Schemas>>
  ) : never

  export type Intersection<Shape extends readonly Schema<any, any>[]> = Schema<
    T2I<Shape>,
    T2I<InferT<Shape>>
  >
  export declare function intersect<
    const T extends readonly [any, ...any[]]
  >(t: T): T['length'] extends 1
    ? TypeT<T>[0]
    : Intersection<TypeT<T>>
}

export const typp: typeof t = t
