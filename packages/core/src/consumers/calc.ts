import type { t as tn, Typp } from '@typp/core'
import type { IsEqual, Stack, T2I } from '../types'

const unionSymbol = Symbol('union')
const intersectionSymbol = Symbol('intersection')

declare module '@typp/core' {
  export namespace t {
    // TODO exclude
    // TODO extract
    export interface ShapeEntries<T, Rest extends any[]> {
      300000: [
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['union']>
        ) : false,
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          // TODO no `t.InferT`?
          t.Union<t.InferT<T['schemas']>>
        ) : never
      ]
      300001: [
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['intersection']>
        ) : false,
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          Intersect<T['schemas']>
        ) : never
      ]
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
          | IsEqual<U, Typp<[{}]>>
          | IsEqual<U, Typp<[unknown]>>
        )
      ) ? t.Schema<StringConstructor, string & {}>
        : (
          S extends t.SpecialShape<
            t.SpecialShapeTypeMapping['intersection'],
            infer Schemas extends readonly [any, ...any]
          > ? Intersect<[...Schemas, U]>
            : Intersect<[S, U]>
        )
      or<
        const U,
        const S extends Shape = Shape
      >(t: U): (
        S extends t.SpecialShape<t.SpecialShapeTypeMapping['union'], infer Schemas>
          ? Union<[...Schemas, U]>
          : Union<[S, U]>
      )
    }
    export type Union<
      Shapes extends readonly any[],
      T = Shapes[number]
    > = Shapes['length'] extends infer L ? L extends 0 ? (
      Typp<[never]>
    ) : L extends 1 ? (
      t.TyppWhenNotATypp<Shapes[0]>
    ) : [
      t.Typps<T>,
      t.TyppT<Shapes>
    ] extends [
      infer Schemas extends t.Schema<any, any>,
      infer SchemaT extends t.Schema<any, any>[]
    ] ? (
      [Schemas] extends [never]
        ? Typp<[never]>
        : t.Schema<
          t.SpecialShape<t.SpecialShapeTypeMapping['union'], SchemaT>,
          t.Infers<Schemas>
        >
    ) : never : never
    export function union<const T extends readonly any[]>(t: T): Union<T>
    export { union as or }

    export type Intersect<
      Shapes extends readonly [any, ...any[]]
    > = Shapes['length'] extends infer L ? L extends 1 ? (
      t.TyppWhenNotATypp<Shapes[0]>
    ) : (
      Stack.Shift<Shapes> extends [infer Head, infer Tail] ? (
        [Head] extends [never] ? (
          // never & xx => never
          Typp<[never]>
        ) : true extends IsEqual<Head, any> ? (
          // any & xx => any
          // TODO any & never => never
          t.Schema<any, any>
        ) : t.TyppT<Shapes> extends (
            infer Schemas extends readonly t.Schema<any, any>[]
          ) ? (
            [Schemas] extends [never]
              ? Typp<[never]>
              : t.Schema<
                t.SpecialShape<t.SpecialShapeTypeMapping['intersection'], Schemas>,
                T2I<t.InferT<Schemas>>
              >
          ) : never
      ) : never
    ) : never
    export function intersect<const T extends readonly [any, ...any[]]>(i: T): Intersect<T>
    export { intersect as and, intersect as intersection }
  }
}

export default function (ctx: typeof tn) {
  const t = ctx
  t.useSpecialShapeType('union', unionSymbol)
  t.useSpecialShapeType('intersection', intersectionSymbol)
  t.useStatic('union', <const T extends readonly any[]>(types: T) => {
    if (types.length === 0) return t(
      t.specialShape(t.specialShapeTypeMapping.never)
    ) as unknown as tn.Union<T>
    if (types.length === 1) return t(
      types[0]
    ) as unknown as tn.Union<T>

    return t(t.specialShape(
      t.specialShapeTypeMapping.union,
      types.map(type => t(type))
    )) as unknown as tn.Union<T>
  })
  t.useStatic('intersect', <const T extends readonly [any, ...any[]]>(i: T) => {
    if (i.length === 0) throw new Error('intersect() requires at least one argument')
    if (i.length === 1) return t(
      i[0]
    ) as unknown as tn.Intersect<T>

    return t(t.specialShape(
      t.specialShapeTypeMapping.intersection,
      i.map(type => t(type))
    )) as unknown as tn.Intersect<T>
  })
  t.useStatic.proxy('intersect', 'and')
  t.useStatic.proxy('intersect', 'intersection')

  function merge(s: tn.Schema<any, any>, i: any, type: 'union' | 'intersection') {
    if (!t.isWhatSpecialShape(type, s)) {
      switch (type) {
        case 'union':
          return t.union([s, i])
        case 'intersection':
          return t.intersect([s, i])
      }
    }
    const nt = t.clone(s)
    nt.shape = {
      type: s.shape.type,
      schemas: [...s.shape.schemas, t(i)]
    }
    return nt as any
  }
  t.useFields({
    and(t) {
      return merge(this, t, 'intersection')
    },
    or(t) {
      return merge(this, t, 'union')
    }
  })
}
