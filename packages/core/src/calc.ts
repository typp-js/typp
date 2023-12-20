import type { Typp } from '.'
import type { IsEqual, T2I } from './types'

declare module '@typp/core' {
  // Calculate type
  export namespace t {
    import Symbols = t.Symbols

    // TODO exclude
    // TODO extract
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping.union]: readonly t.Schema<any, any>[]
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping.intersection]: readonly t.Schema<any, any>[]
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
          | IsEqual<U, t.Schema<{}, {}>>
          | IsEqual<U, t.Schema<typeof Symbols.unknown, unknown>>
        )
      ) ? t.Schema<StringConstructor, string & {}>
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
        t.Typps<T>,
        t.TyppT<Shapes>
      ] extends [
        infer Schemas extends t.Schema<any, any>,
        infer SchemaT extends t.Schema<any, any>[]
      ] ? (
        [Schemas] extends [never]
          ? t.Schema<typeof t.Symbols.never, never>
          : t.Schema<
            t.SpecialShape<t.SpecialShapeTypeMapping['union'], SchemaT>,
            t.Infers<Schemas>
          >
      ) : never
    export function union<const T extends readonly any[]>(t: T): Union<T>
    export { union as or }

    export type Intersect<
      Shapes extends readonly [any, ...any[]]
    > = Shapes['length'] extends 1
      ? t.TyppWhenNotATypp<Shapes[0]>
      : t.TyppT<Shapes> extends (
        infer Schemas extends readonly t.Schema<any, any>[]
      ) ? (
        [Schemas] extends [never]
          ? t.Schema<typeof t.Symbols.never, never>
          : t.Schema<
            t.SpecialShape<t.SpecialShapeTypeMapping['intersection'], Schemas>,
            T2I<t.InferT<Schemas>>
          >
      ) : never
    export function intersect<const T extends readonly [any, ...any[]]>(t: T): Intersect<T>
    export { intersect as and }
  }
}
