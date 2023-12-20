import type { Typp } from '..'
import { t } from '..'
import type { IsEqual } from '../types'

const symbols = Object.freeze({
  void: Symbol('void'),
  unknown: Symbol('unknown'),
  never: Symbol('never')
}) as {
  readonly void: unique symbol
  readonly unknown: unique symbol
  readonly never: unique symbol
}
t.defineStatic('Symbols', symbols)

declare module '@typp/core' {
  namespace t {
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
t.defineStatic('any', () => <t.Schema<any, any>>({}))
t.defineStatic('unknown', () => <t.Schema<typeof symbols.unknown, unknown>>({}))
t.defineStatic('string', () => <t.Schema<StringConstructor, string>>({}))
t.defineStatic('number', () => <t.Schema<NumberConstructor, number>>({}))
t.defineStatic('bigint', () => <t.Schema<BigIntConstructor, bigint>>({}))
t.defineStatic('boolean', () => <t.Schema<BooleanConstructor, boolean>>({}))
t.defineStatic('symbol', () => <t.Schema<SymbolConstructor, symbol>>({}))
t.defineStatic('date', () => <t.Schema<DateConstructor, Date>>({}))
t.defineStatic('regexp', () => <t.Schema<RegExpConstructor, RegExp>>({}))
t.defineStatic('undefined', () => <t.Schema<undefined, undefined>>({}))
t.defineStatic('never', () => <t.Schema<typeof symbols.never, never>>({}))
t.defineStatic('null', () => <t.Schema<null, null>>({}))
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

export type PrimitiveMapping<T> = true extends (
  [T] extends [string | number | bigint | boolean | symbol] ? true : false
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
