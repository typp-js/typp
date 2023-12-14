import { ConstructorMapping, IsEqual, IsNotEqual, Stack, UseWhenNoNever } from './base'
import { ArrayConsume } from './consumers/array'
import { MapConsume } from './consumers/map'
import { ObjectConsume } from './consumers/object'
import { SetConsume } from './consumers/set'
import { t } from '.'

type Consume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<T, ArrayConstructor>
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? (
  ArrayConsume<T, Rest>
) : true extends (
  | IsEqual<T, ObjectConstructor>
  | IsEqual<T, {}>
  | (
    & ([T] extends [Record<string | number | symbol, any>] ? true : false)
    & IsNotEqual<T, ObjectConstructor>
    & ([T] extends [Function] ? false : true)
  )
) ? (
  ObjectConsume<T, Rest>
) : true extends (
  IsEqual<T, MapConstructor>
) ? (
  MapConsume<T, Rest>
) : true extends (
  IsEqual<T, SetConstructor>
) ? (
  SetConsume<T, Rest>
) : never

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

type PrimitiveMapping<T> = true extends (
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
  IsEqual<null, T>
) ? (
  t.Schema<null, null>
) : true extends (
  IsEqual<undefined, T>
) ? (
  t.Schema<undefined, undefined>
) : true extends (
  IsEqual<void, T>
) ? (
  t.Schema<typeof t.Symbols.void, void>
) : true extends (
  IsEqual<unknown, T>
) ? (
  t.Schema<typeof t.Symbols.unknown, unknown>
) : true extends (
  IsEqual<never, T>
) ? (
  t.Schema<typeof t.Symbols.never, never>
) : never

type InferInstanceType<T> = ConstructorMapping<T> extends infer InferInstanceType
  ? [InferInstanceType] extends [never]
    ? PrimitiveMapping<T>
    : t.Schema<T, InferInstanceType>
  : never

type InferSpecialShape<T> = [T] extends [
  t.SpecialShape<t.SpecialShapeTypes, any>
] ? true extends IsEqual<T['type'], t.SpecialShapeTypeMapping['union']>
    // TODO no `t.InferT`?
    ? t.Union<t.InferT<T['schemas']>>
    : true extends IsEqual<T['type'], t.SpecialShapeTypeMapping['intersection']>
      ? t.Intersect<T['schemas']>
      : never
  : never

export type Consumer<T extends readonly any[]> =
  Stack.Shift<T> extends [infer L, infer Rest extends any[]]
    ? UseWhenNoNever<
        InferSpecialShape<L>,
        UseWhenNoNever<
          Consume<L, Rest>,
          InferInstanceType<L>
        >
    >
    : never
