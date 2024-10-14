import type { t as tn, Typp } from '@typp/core'
import type { IsEqual, IsNotEqual, IsWhat, NoIndexSignature, ValueOf, Values } from '../types'

interface Symbols {
  readonly any: unique symbol
  readonly void: unique symbol
  readonly unknown: unique symbol
  readonly never: unique symbol
}

const symbols = Object.freeze({
  any: Symbol('any'),
  void: Symbol('void'),
  unknown: Symbol('unknown'),
  never: Symbol('never')
}) as Symbols

type LiteralPlaceholder<T extends string = string> = `__DO_NOT_USE_SAME_LITERAL_${T}__IF_YOU_WANT_TO_USE_IT__`
function literalPlaceholder<T extends string>(type: T): LiteralPlaceholder<T> {
  return `__DO_NOT_USE_SAME_LITERAL_${type}__IF_YOU_WANT_TO_USE_IT__`
}

declare module '@typp/core/base' {
  // Consumer
  namespace t {
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
      // eslint-disable-next-line ts/no-unsafe-function-type
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
      t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['void']>, void>
    ) : true extends IsEqual<T, unknown> ? (
      t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['unknown']>, unknown>
    ) : true extends IsEqual<T, never> ? (
      t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['never']>, never>
    ) : never
  }
  // Extend
  namespace t {
    export interface DynamicSpecialShapeTypeMapping {
      readonly any: typeof Symbols.any
      readonly void: typeof Symbols.void
      readonly unknown: typeof Symbols.unknown
      readonly never: typeof Symbols.never
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping
        .any]: undefined
      [t.specialShapeTypeMapping
        .void]: undefined
      [t.specialShapeTypeMapping
        .unknown]: undefined
      [t.specialShapeTypeMapping
        .never]: undefined
    }
    export interface ShapeEntries<T, Rest extends any[]> {
      500000: [true extends (
        | ([T] extends [(
          | string | number | bigint | boolean | symbol
          | Values<NoIndexSignature<ConstructorEntries>>[0]
        )] ? true : false)
        | IsWhat<T, null>
        | IsWhat<T, undefined>
        | IsWhat<T, void>
        | IsWhat<T, unknown>
        | IsWhat<T, never>
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

    // TODO replace `Typp` to `t.Schema`, maybe get better performance?
    //      It should be tested.
    // 或许统一逻辑会比性能优化更重要，当完成项目后可以考虑测试该部分内容，如果对性能影响比较大
    // 则可考虑优化这部分实现，或者当影响不大的时候不优化了
    export function any(): Typp<[]>
    export function unknown(): Typp<[unknown]>
    export function string(): Typp<[StringConstructor]>
    export function number(): Typp<[NumberConstructor]>
    export function bigint(): Typp<[BigIntConstructor]>
    export function boolean(): Typp<[BooleanConstructor]>
    export function symbol(): Typp<[SymbolConstructor]>
    export function date(): Typp<[DateConstructor]>
    export function regexp(): Typp<[RegExpConstructor]>
    export function undefined(): Typp<[undefined]>
    export function never(): Typp<[never]>

    function _null(): Typp<[null]>
    function _void(): Typp<[void]>
    export { _null as null, _void as void }

    interface Literal {
      <
        // TODO remove type extends limit
        T extends string | number | bigint | symbol | boolean | null | undefined
      >(value: T): Typp<[T]>
      BigInt: LiteralPlaceholder<'BIGINT'>
      Boolean: LiteralPlaceholder<'BOOLEAN'>
      Number: LiteralPlaceholder<'NUMBER'>
      String: LiteralPlaceholder<'STRING'>
      Null: LiteralPlaceholder<'NULL'>
      Undefined: LiteralPlaceholder<'UNDEFINED'>
    }
    const _literal: Literal
    export {
      _literal as const,
      _literal as literal
    }
  }
}

export default function (ctx: typeof tn) {
  const t = ctx

  function literal<
    T extends string | number | bigint | symbol | null | boolean | undefined
  >(value: T): Typp<[T]> {
    return t(value)
  }
  literal.BigInt = literalPlaceholder('BIGINT')
  literal.Boolean = literalPlaceholder('BOOLEAN')
  literal.Number = literalPlaceholder('NUMBER')
  literal.String = literalPlaceholder('STRING')
  literal.Null = literalPlaceholder('NULL')
  literal.Undefined = literalPlaceholder('UNDEFINED')
  t.useConsumer(first => {
    if ([
      'string',
      'number',
      'bigint',
      'boolean',
      'symbol'
    ].includes(typeof first)) {
      return [first]
    }
  })
  t.useConsumer((...args) => {
    if (args.length === 0) {
      return [t.specialShape(symbols.any)]
    }
    // TODO when pass t.Symbols, return target specialShape schema
    const [first, ...rest] = args
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
  t.useStatic('Symbols', symbols)
  t.useSpecialShapeType('any', symbols.any)
  t.useSpecialShapeType('void', symbols.void)
  t.useSpecialShapeType('unknown', symbols.unknown)
  t.useSpecialShapeType('never', symbols.never)
  t.useStatic('any', () => t(t.specialShape(symbols.any)))
  t.useStatic('unknown', () => t(t.specialShape(symbols.unknown)))
  t.useStatic('string', () => t(String))
  t.useStatic('number', () => t(Number))
  t.useStatic('bigint', () => t(BigInt))
  t.useStatic('boolean', () => t(Boolean))
  t.useStatic('symbol', () => t(Symbol))
  t.useStatic('date', () => t(Date))
  t.useStatic('regexp', () => t(RegExp))
  t.useStatic('undefined', () => t(undefined))
  t.useStatic('null', () => t(null))
  t.useStatic('never', () =>t(t.specialShape(symbols.never)))
  t.useStatic('void', () => t(t.specialShape(symbols.void)))
  t.useStatic('literal', literal)
  t.useStatic.proxy('literal', 'const')
}
