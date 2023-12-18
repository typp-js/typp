import { IsEqual, IsNotEqual, T2I, ValueOf } from './base'
import { Consumer } from './comsumer'

export type Typp<T extends readonly any[]> = true extends (
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? t.Schema<any, any> : Consumer<T>

export function t<const T extends any[]>(...t: T): Typp<T> {
  return {} as Typp<T>
}

const symbols = Object.freeze({
  void: Symbol('void'),
  unknown: Symbol('unknown'),
  never: Symbol('never')
}) as {
  readonly void: unique symbol
  readonly unknown: unique symbol
  readonly never: unique symbol
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

t.function = t.fn

// Base type
export namespace t {
  export interface DynamicSpecialShapeTypeMapping {
    readonly [key: string]: symbol
  }
  export const specialShapeTypeMapping = {
    union: Symbol('union'),
    intersection: Symbol('intersection')
  } as {
    readonly union: unique symbol
    readonly intersection: unique symbol
  } & DynamicSpecialShapeTypeMapping
  export function defineSpecialShapeType<
    T extends keyof DynamicSpecialShapeTypeMapping,
    S extends DynamicSpecialShapeTypeMapping[T]
  >(type: T, symbol: S): void {
    specialShapeTypeMapping[type] = symbol
  }
  export interface SpecialShapeSchemaMapping {
    [k: SpecialShapeTypes]: any
  }
  export interface SpecialShapeSchemaMapping {
    [specialShapeTypeMapping.union]: readonly Schema<any, any>[]
  }
  export interface SpecialShapeSchemaMapping {
    [specialShapeTypeMapping.intersection]: readonly Schema<any, any>[]
  }
  export type SpecialShapeTypeMapping = typeof specialShapeTypeMapping
  export type SpecialShapeTypes = SpecialShapeTypeMapping[keyof SpecialShapeTypeMapping]
  export interface SpecialShape<
    T extends SpecialShapeTypes,
    S extends SpecialShapeSchemaMapping[T]
  > {
    type: T
    schemas: S
  }
  export interface SchemaMeta<Shape, T> {
  }
  export interface SchemaMethodsEntries<A = any, B = any, C = any> {
    [key: number & {}]: [boolean, any]
  }
  export type SchemaMethodsMapping<
    A = any, B = any, C = any,
    Entries extends SchemaMethodsEntries<A, B, C> = SchemaMethodsEntries<A, B, C>
  > = [keyof Entries] extends [infer Keys extends number] ? (
    ValueOf<{
      [ K in Keys
        as true extends (
          & Entries[K][0]
          & IsNotEqual<K, number & {}>
        ) ? K : never
      ]: Entries[K][1]
    }> extends infer R
      ? [R] extends [never] ? {} : R
      : never
  ) : {}
  export interface SchemaMethodsAll<Shape, T> {
    // TODO keyof
    // TODO omit
    // TODO pick
    // TODO exclude
    // TODO extract
    // TODO nonNullable
    // TODO nullable
    // TODO readonly
    // TODO mutable
    // TODO partial
    // TODO required
  }
  export type SchemaMethods<Shape, T> =
    & SchemaMethodsMapping<Shape, T>
    & SchemaMethodsAll<Shape, T>
  export interface SchemaFields<Shape, T> {
    shape: Shape
    meta: SchemaMeta<Shape, T>
  }

  type _Schema<Shape, T> =
    & SchemaFields<Shape, T>
    & SchemaMethods<Shape, T>
  export interface Schema<Shape, T> extends _Schema<Shape, T> {}
  export type Infer<T extends Schema<any, any>> = [T] extends [never]
    ? never
    : [T] extends [Schema<any, infer R>] ? R : never

  export type TyppWhenNotATypp<T> = [T] extends [Schema<any, any>] ? T : Typp<[T]>
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
  export type InferT<T extends readonly Schema<any, any>[]> = T extends readonly [
    infer Item extends Schema<any, any>,
    ...infer Rest extends readonly Schema<any, any>[]
  ] ? (
    [Infer<Item>, ...InferT<Rest>]
  ) : []
}
// Base static function
export namespace t {
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
}
// Calculate type
export namespace t {
  export interface SchemaMethodsAll<Shape, T> {
    and<
      const U extends any,
      Shapes extends readonly [any, ...any[]] = [Shape, U]
    >(t: U): true extends (
      & ([T] extends [string] ? true : false)
      & (
        | IsEqual<U, {}>
        | IsEqual<U, unknown>
        | IsEqual<U, Schema<{}, {}>>
        | IsEqual<U, Schema<typeof symbols.unknown, unknown>>
      )
    ) ? Schema<StringConstructor, string & {}>
      : Intersect<Shapes>
    or<
      const U extends readonly any[],
      Shapes extends readonly [any, ...any[]] = [Shape, ...U]
    >(...t: U): Union<Shapes>
  }
  export type Union<
    Shapes extends readonly any[],
    T = Shapes[number]
  > = Shapes['length'] extends 1
    ? Typp<Shapes>
    : [
      Typps<T>,
      TyppT<Shapes>
    ] extends [
      infer Schemas extends Schema<any, any>,
      infer SchemaT extends Schema<any, any>[]
    ] ? (
      [Schemas] extends [never]
        ? Schema<typeof symbols.never, never>
        : Schema<
          SpecialShape<SpecialShapeTypeMapping['union'], SchemaT>,
          Infers<Schemas>
        >
    ) : never
  export declare function union<
    const T extends readonly any[]
  >(t: T): Union<T>
  export const or = union

  export type Intersect<
    Shapes extends readonly [any, ...any[]]
  > = Shapes['length'] extends 1
    ? TyppWhenNotATypp<Shapes[0]>
    : TyppT<Shapes> extends (
      infer Schemas extends readonly Schema<any, any>[]
    ) ? (
      [Schemas] extends [never]
        ? Schema<typeof symbols.never, never>
        : Schema<
          SpecialShape<SpecialShapeTypeMapping['intersection'], Schemas>,
          T2I<InferT<Schemas>>
        >
    ) : never
  export declare function intersect<
    const T extends readonly [any, ...any[]]
  >(t: T): Intersect<T>
  export const and = intersect
}

export const typp: typeof t = t
