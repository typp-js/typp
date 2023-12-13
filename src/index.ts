import { IsEqual, T2I, ULength } from './base'
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

export namespace t {
  interface SchemaMeta<Shape, T> {
  }
  interface SchemaMethods<Shape, T> {
    or<const U>(t: readonly U[]): Union<Shape | U>
  }
  export type Schema<Shape, T> =
    & {
      shape: Shape
      meta: SchemaMeta<Shape, T>
    }
    & SchemaMethods<Shape, T>
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

  type TyppWhenNotATypp<T> = T extends Schema<any, any> ? T : Typp<[T]>
  // make every item of `union` type which wrapped `Typp` for getting `Schema`
  export type Typps<T> = T extends infer Item ? TyppWhenNotATypp<Item> : never
  // infer type from every item of `union` type
  export type Infers<T> = T extends (
    infer Item extends Schema<any, any>
  ) ? Infer<Item> : never

  // make every item of `tuple` type which wrapped `Typp` for getting `Schema`
  export type TyppT<T extends readonly any[]> = T extends readonly [
    infer Item, ...infer Rest extends any[]
  ] ? (
    [TyppWhenNotATypp<Item>, ...TyppT<Rest>]
  ) : []
  // infer type from every item of `tuple` type
  export type InferT<T extends readonly Schema<any, any>[]> = T extends [
    infer Item extends Schema<any, any>,
    ...infer Rest extends readonly Schema<any, any>[]
  ] ? (
    [Infer<Item>, ...InferT<Rest>]
  ) : []
  export type Union<T> = ULength<T> extends 1
    ? Typp<[T]>
    : Typps<T> extends infer Schemas ? (
      [Schemas] extends [never]
        ? Schema<typeof symbols.never, never>
        : Schema<Schemas, Infers<Schemas>>
    ) : never
  export declare function union<const T>(t: readonly T[]): Union<T>
  export const or = union

  export type Intersection<Shapes extends readonly any[]> = TyppT<Shapes> extends (
    infer Schemas extends readonly Schema<any, any>[]
  ) ? (
    [Schemas] extends [never]
      ? Schema<typeof symbols.never, never>
      : Schema<
        T2I<Schemas>,
        T2I<InferT<Schemas>>
      >
  ) : never
  export declare function intersect<
    const T extends readonly [any, ...any[]]
  >(t: T): T['length'] extends 1
    ? TyppT<T>[0]
    : Intersection<T>
  export const and = intersect
}

export const typp: typeof t = t
