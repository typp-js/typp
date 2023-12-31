import { t } from '../base'
import type { Typp } from '../index'
import type { IsEqual, Stack, T2I } from '../types'

const unionSymbol = Symbol('union')
const intersectionSymbol = Symbol('intersection')

declare module '../base' {
  export namespace t {
    // TODO exclude
    // TODO extract
    export interface ShapeEntries<T, Rest extends any[]> {
      300000: [(
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['union']>
          ) : false
        ), [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
        // TODO no `t.InferT`?
        t.Union<t.InferT<T['schemas']>>
        ) : never]
      300001: [(
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['intersection']>
          ) : false
        ), [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
        Intersect<T['schemas']>
        ) : never]
    }
    export interface DynamicSpecialShapeTypeMapping {
      readonly union: typeof unionSymbol
      readonly intersection: typeof intersectionSymbol
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping.union]: readonly t.Schema<any, any>[]
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping.intersection]: readonly t.Schema<any, any>[]
    }
    export interface SchemaFieldsAll<Shape, T> {
      and<
        const U,
        const S extends Shape = Shape
      >(u: U): true extends (
        & ([T] extends [string] ? true : false)
        & (
          | IsEqual<U, {}>
          | IsEqual<U, unknown>
          | IsEqual<U, t.Schema<{}, {}>>
          | IsEqual<U, t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['unknown'], []>, unknown>>
        )
      ) ? t.Schema<StringConstructor, string & {}>
        : Intersect<[S, U]>
      or<
        const U,
        const S extends Shape = Shape
      >(t: U): Union<[S, U]>
    }
    export type Union<
      Shapes extends readonly any[],
      T = Shapes[number]
    > = Shapes['length'] extends 0
      // TODO replace to Typp<[never]>
      ? t.Schema<t.SpecialShape<typeof t.Symbols.never, []>, never>
      : Shapes['length'] extends 1
      ? t.TyppWhenNotATypp<Shapes[0]>
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
      : Stack.Shift<Shapes> extends [
        infer Head,
        infer Tail
      ] ? (
        [Head] extends [never] ? (
          // never & xx => never
          t.Schema<typeof t.Symbols.never, never>
        ) : true extends IsEqual<Head, any> ? (
          // any & xx => any
          // TODO any & never => never
          t.Schema<any, any>
        ) : t.TyppT<Shapes> extends (
            infer Schemas extends readonly t.Schema<any, any>[]
          ) ? (
            [Schemas] extends [never]
              ? t.Schema<typeof t.Symbols.never, never>
              : t.Schema<
                t.SpecialShape<t.SpecialShapeTypeMapping['intersection'], Schemas>,
                T2I<t.InferT<Schemas>>
              >
          ) : never
      ) : never
    export function intersect<const T extends readonly [any, ...any[]]>(i: T): Intersect<T>
    export { intersect as and, intersect as intersection }
  }
}
t.defineSpecialShapeType('union', unionSymbol)
t.defineSpecialShapeType('intersection', intersectionSymbol)
// TODO
t.defineStatic('union', <const T extends readonly any[]>(i: T) => {
  return <t.Union<T>>{}
})
// TODO
t.defineStatic('intersect', <const T extends readonly [any, ...any[]]>(i: T) => (<t.Intersect<T>>{}))
t.defineStatic.proxy('intersect', 'and')
t.defineStatic.proxy('intersect', 'intersection')
