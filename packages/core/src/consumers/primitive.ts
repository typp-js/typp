import type { t } from '..'
import type { IsEqual } from '../types'

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
