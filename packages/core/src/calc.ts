import type { IsEqual, T2I } from './types'

declare module '@typp/core' {
  // Calculate type
  export namespace t {
    import Symbols = t.Symbols
    import specialShapeTypeMapping = t.specialShapeTypeMapping
    import Schema = t.Schema
    import Typps = t.Typps
    import TyppT = t.TyppT
    import SpecialShape = t.SpecialShape
    import SpecialShapeTypeMapping = t.SpecialShapeTypeMapping
    import Infers = t.Infers
    import TyppWhenNotATypp = t.TyppWhenNotATypp
    import InferT = t.InferT

    // TODO exclude
    // TODO extract
    export interface SpecialShapeSchemaMapping {
      [specialShapeTypeMapping.union]: readonly Schema<any, any>[]
    }
    export interface SpecialShapeSchemaMapping {
      [specialShapeTypeMapping.intersection]: readonly Schema<any, any>[]
    }
    export interface SchemaMethodsAll<Shape, T> {
      and<
        const U,
        Shapes extends readonly [any, ...any[]] = [Shape, U]
      >(t: U): true extends (
        & ([T] extends [string] ? true : false)
        & (
          | IsEqual<U, {}>
          | IsEqual<U, unknown>
          | IsEqual<U, Schema<{}, {}>>
          | IsEqual<U, Schema<typeof Symbols.unknown, unknown>>
        )
      ) ? Schema<StringConstructor, string & {}>
        : Intersect<Shapes>
      or<
        const U,
        Shapes extends readonly [any, ...any[]] = [Shape, U]
      >(t: U): Union<Shapes>
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
          ? Schema<typeof Symbols.never, never>
          : Schema<
            SpecialShape<SpecialShapeTypeMapping['union'], SchemaT>,
            Infers<Schemas>
          >
      ) : never
    export function union<const T extends readonly any[]>(t: T): Union<T>
    export { union as or }

    export type Intersect<
      Shapes extends readonly [any, ...any[]]
    > = Shapes['length'] extends 1
      ? TyppWhenNotATypp<Shapes[0]>
      : TyppT<Shapes> extends (
        infer Schemas extends readonly Schema<any, any>[]
      ) ? (
        [Schemas] extends [never]
          ? Schema<typeof Symbols.never, never>
          : Schema<
            SpecialShape<SpecialShapeTypeMapping['intersection'], Schemas>,
            T2I<InferT<Schemas>>
          >
      ) : never
    export function intersect<const T extends readonly [any, ...any[]]>(t: T): Intersect<T>
    export { intersect as and }
  }
}
