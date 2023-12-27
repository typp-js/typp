import type { Typp } from '..'
import { t } from '../base'
import type { IsEqual, IsNotEqual, NoIndexSignature, ValueOf, Values } from '../types'

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
t.defineSpecialShapeType('any', symbols.any)
t.defineSpecialShapeType('void', symbols.void)
t.defineSpecialShapeType('unknown', symbols.unknown)
t.defineSpecialShapeType('never', symbols.never)

declare module '../base' {
  namespace t {
    export interface DynamicSpecialShapeTypeMapping {
      readonly any: typeof Symbols.any
      readonly void: typeof Symbols.void
      readonly unknown: typeof Symbols.unknown
      readonly never: typeof Symbols.never
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping
        .any]: []
      [t.specialShapeTypeMapping
        .void]: []
      [t.specialShapeTypeMapping
        .unknown]: []
      [t.specialShapeTypeMapping
        .never]: []
    }
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
      500001: [(
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['any']>
        ) : false
      ), t.Schema<any, any>]
      500002: [(
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['void']>
        ) : false
      ), t.Schema<T, void>]
      500003: [(
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['unknown']>
        ) : false
      ), t.Schema<T, unknown>]
      500004: [(
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['never']>
        ) : false
      ), t.Schema<T, never>]
    }
    /**
     * rename and export to user
     */
    export const Symbols: typeof symbols

    export function any(): t.Schema<any, any>
    export function unknown(): Typp<[unknown]>
    export function string(): t.Schema<StringConstructor, string>
    export function number(): t.Schema<NumberConstructor, number>
    export function bigint(): t.Schema<BigIntConstructor, bigint>
    export function boolean(): t.Schema<BooleanConstructor, boolean>
    export function symbol(): t.Schema<SymbolConstructor, symbol>
    export function date(): t.Schema<DateConstructor, Date>
    export function regexp(): t.Schema<RegExpConstructor, RegExp>
    export function undefined(): t.Schema<undefined, undefined>
    // FIXME unable compute [never] for `Typp`
    // export function never(): Typp<[never]>
    export function never(): t.Schema<t.SpecialShape<typeof t.Symbols.never, []>, never>

    function _null(): t.Schema<null, null>
    function _void(): Typp<[void]>
    export { _null as null, _void as void }

    const _literal: typeof literal
    export {
      _literal as const,
      _literal as literal
    }
  }
}

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
t.defineStatic('any', () => t(t.specialShape(t.Symbols.any, [])))
t.defineStatic('unknown', () => t(t.specialShape(t.Symbols.unknown, [])))
t.defineStatic('string', () => t(String))
t.defineStatic('number', () => t(Number))
t.defineStatic('bigint', () => t(BigInt))
t.defineStatic('boolean', () => t(Boolean))
t.defineStatic('symbol', () => t(Symbol))
t.defineStatic('date', () => t(Date))
t.defineStatic('regexp', () => t(RegExp))
t.defineStatic('undefined', () => t(undefined))
t.defineStatic('null', () => t(null))
t.defineStatic('never', () =>t(t.specialShape(t.Symbols.never, [])))
t.defineStatic('void', () => t(t.specialShape(t.Symbols.void, [])))

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
  t.Schema<t.SpecialShape<typeof t.Symbols.void, []>, void>
) : true extends IsEqual<T, unknown> ? (
  t.Schema<t.SpecialShape<typeof t.Symbols.unknown, []>, unknown>
) : true extends IsEqual<T, never> ? (
  t.Schema<t.SpecialShape<typeof t.Symbols.never, []>, never>
) : never
