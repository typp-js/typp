import type { Typp } from '..'
import { t } from '../base'
import type { IsEqual, NoIndexSignature, ValueOf, Values } from '../types'

declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      500000: [true extends (
        | ([T] extends [(
          | string | number | bigint | boolean | symbol
          | Values<NoIndexSignature<ConstructorEntries>>[0]
        )] ? true : false)
        | IsEqual<T, null>
        | IsEqual<T, undefined>
        | IsEqual<T, void>
        | IsEqual<T, unknown>
        | IsEqual<T, never>
      ) ? true : false, PrimitiveConsume<T>]
    }
    /**
     * rename and export to user
     */
    export const Symbols: typeof symbols

    export function any(): t.Schema<any, any>
    export function unknown(): t.Schema<typeof Symbols.unknown, unknown>
    export function string(): t.Schema<StringConstructor, string>
    export function number(): t.Schema<NumberConstructor, number>
    export function bigint(): t.Schema<BigIntConstructor, bigint>
    export function boolean(): t.Schema<BooleanConstructor, boolean>
    export function symbol(): t.Schema<SymbolConstructor, symbol>
    export function date(): t.Schema<DateConstructor, Date>
    export function regexp(): t.Schema<RegExpConstructor, RegExp>
    export function undefined(): t.Schema<undefined, undefined>
    export function never(): t.Schema<typeof Symbols.never, never>

    function _null(): t.Schema<null, null>
    function _void(): t.Schema<typeof Symbols.void, void>
    export { _null as null, _void as void }

    const _literal: typeof literal
    export {
      _literal as const,
      _literal as literal
    }
  }
}

const symbols = Object.freeze({
  any: Symbol('any'),
  void: Symbol('void'),
  unknown: Symbol('unknown'),
  never: Symbol('never')
}) as {
  readonly any: unique symbol
  readonly void: unique symbol
  readonly unknown: unique symbol
  readonly never: unique symbol
}
t.defineStatic('Symbols', symbols)

t.defineConsumer((first, ...rest) => {
  if ([
    String,
    Number,
    BigInt,
    Boolean,
    Symbol,
    Date,
    RegExp,
    undefined,
    null
  ].includes(first)) {
    return [first] as const
  }
})
t.defineStatic('any', () => <t.Schema<any, any>>({}))
t.defineStatic('unknown', () => <t.Schema<typeof symbols.unknown, unknown>>({}))
t.defineStatic('string', () => t(String))
t.defineStatic('number', () => t(Number))
t.defineStatic('bigint', () => t(BigInt))
t.defineStatic('boolean', () => t(Boolean))
t.defineStatic('symbol', () => t(Symbol))
t.defineStatic('date', () => t(Date))
t.defineStatic('regexp', () => t(RegExp))
t.defineStatic('undefined', () => t(undefined))
t.defineStatic('null', () => t(null))
t.defineStatic('never', () => <t.Schema<typeof symbols.never, never>>({}))
t.defineStatic('void', () => <t.Schema<typeof symbols.void, void>>({}))

function literal<
  T extends string | number | bigint | symbol | null | boolean | undefined
>(value: T): Typp<[T]> {
  return {} as Typp<[T]>
}
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
t.defineStatic('literal', literal)
// TODO proxy `const` to `literal`

type LiteralPlaceholder<T extends string = string> = `__DO_NOT_USE_SAME_LITERAL_${T}__IF_YOU_WANT_TO_USE_IT__`
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
type JoinLiteral<T extends readonly any[]> = T extends readonly [
    infer L extends LiteralStringMapping[keyof LiteralStringMapping],
    infer R extends LiteralStringMapping[keyof LiteralStringMapping],
    ...infer Rest
  ] ? `${L}${R}${JoinLiteral<Rest>}`
  : T extends readonly [infer L]
    ? L extends string ? L : never
    : ''

export interface ConstructorEntries<
  A = any, B = any, C = any, D = any, E = any
> {
  1000: [StringConstructor, string]
  1001: [NumberConstructor, number]
  1002: [BigIntConstructor, bigint]
  1003: [BooleanConstructor, boolean]
  1004: [SymbolConstructor, symbol]
  1005: [DateConstructor, Date]
  1006: [RegExpConstructor, RegExp]
  [key: number]: [Function, any]
}

export type ConstructorMapping<
  T,
  A = any, B = any, C = any, D = any, E = any,
  Entries extends ConstructorEntries<A, B, C> = ConstructorEntries<A, B, C>
> = ValueOf<{
  [ K in keyof Entries
      as IsEqual<
        Entries[K & number][0], T
      > extends true ? number : never
  ]: Entries[K & number][1]
}>

export type PrimitiveConsume<T> = true extends (
  & IsNotEqual<T, never>
  & ([T] extends [Values<NoIndexSignature<ConstructorEntries>>[0]] ? true : false)
) ? (
  t.Schema<T, ConstructorMapping<T>>
) : true extends (
  & ([T] extends [string | number | bigint | boolean | symbol] ? true : false)
  & IsNotEqual<T, never>
) ? (
  [T] extends [string] ? (
    JoinLiteral<SplitLiteral<T>> extends infer S
      ? [S] extends [string]
        ? t.Schema<S, S>
        : never
      : never
  ) : t.Schema<T, T>
) : true extends (
  | IsEqual<T, null>
  | IsEqual<T, undefined>
) ? (
  t.Schema<T, T>
) : true extends IsEqual<T, void> ? (
  t.Schema<typeof t.Symbols.void, void>
) : true extends IsEqual<T, unknown> ? (
  t.Schema<typeof t.Symbols.unknown, unknown>
) : true extends IsEqual<T, never> ? (
  t.Schema<typeof t.Symbols.never, never>
) : never
