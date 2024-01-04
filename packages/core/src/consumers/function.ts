import type { Typp } from '../base'
import { t } from '../base'
import type { Collect, IsEqual, IsNotEqual, Replace, Stack } from '../types'

const functionSymbol = Symbol('function')
const genericSymbol = Symbol('generic')

function _generic<
  const L extends string,
  E extends t.Schema<any, any> = t.Schema<any, any>,
  D extends t.Infer<E> = never
>(label: L, _extends?: E, _default?: D) {
  return t.specialShape(genericSymbol, {
    label,
    extends: _extends ?? t(),
    default: _default
  }) as t.SpecialShape<
    t.SpecialShapeTypeMapping['generic'],
    t.Generic<L, E, D>
  >
}
function _fn<
  const Args extends readonly any[],
  RT extends readonly any[] = []
>(args: Args, ...rt: RT): Typp<[FunctionConstructor, Args, ...RT]> {
  return t(Function, args, ...rt)
}
t.defineSpecialShapeType('function', functionSymbol)
t.defineSpecialShapeType('generic', genericSymbol)

t.defineConsumer((first, ...rest) => {
  if (first !== Function) return

  const [args = [], ...rt] = rest as [(readonly any[])?, ...any[]]
  const argsSchemas = args.map(arg => t(arg))
  let rtSchema: t.Schema<any, any>
  if (rt.length === 0) {
    rtSchema = t.void()
  } else {
    rtSchema = t(...rt)
  }
  return [t.specialShape(functionSymbol, [argsSchemas, rtSchema])]
})

t.defineStatic('fn', _fn)
t.defineStatic.proxy('fn', 'function')
t.defineStatic('generic', _generic)

declare module '../base' {
  namespace t {
    type FunctionConsume<
      T,
      Rest extends any[]
    > = true extends (
      | IsEqual<Rest, []>
      | IsEqual<Rest, readonly []>
    ) ? (
      t.Schema<
        t.SpecialShape<t.SpecialShapeTypeMapping['function'], [[], t.Schema<typeof t.Symbols.void, void>]>,
        () => void
      >
    ) : (
      Stack.Shift<Rest> extends [
        infer Args extends readonly any[],
        infer Rest extends readonly any[]
      ] ? (
        [
          t.TyppT<Args>,
          true extends (
            | IsEqual<Rest, []>
            | IsEqual<Rest, readonly []>
          ) ? t.Schema<typeof t.Symbols.void, void>
            : Typp<Rest>
        ] extends [
          infer ArgsSchemas extends readonly t.Schema<any, any>[],
          infer RestSchema extends t.Schema<any, any>
        ] ? (
          [
            Collect<t.InferT<ArgsSchemas>, t.Generic<string>>,
          ] extends [
            infer Generics extends readonly t.Generic<string>[],
          ] ? (
            AggregationGenerics<Generics> extends infer AGenerics extends readonly t.Generic<string>[] ? (
              t.Schema<
                t.SpecialShape<t.SpecialShapeTypeMapping['function'], [ArgsSchemas, RestSchema]>,
                AGenerics['length'] extends 0 ? (
                  (...args: t.InferT<ArgsSchemas>) => t.Infer<RestSchema>
                ) : (
                  GenericsFuncMap<AGenerics, t.InferT<ArgsSchemas>, t.Infer<RestSchema>>[Generics['length']]
                )
              >
            ) : never
          ) : never
        ) : never
      ) : never
    )

    type InferGenericsFromSpecialShapes<
      SpecialShapes extends readonly t.SpecialShape<any, any>[]
    > = SpecialShapes extends readonly [
      infer L extends t.SpecialShape<any, any>,
      ...infer R extends readonly t.SpecialShape<any, any>[]
    ] ? L extends t.SpecialShape<t.SpecialShapeTypeMapping['generic'], infer Generic> ? (
      [Generic] extends [t.Generic<string>] ? [Generic, ...InferGenericsFromSpecialShapes<R>] : never
    ) : never : []

    type AggregationGenerics<
      Generics extends readonly t.Generic<string>[],
      Output extends t.Generic<string>[] = []
    > = Generics extends readonly [
      infer L extends t.Generic<string>,
      ...infer R extends readonly t.Generic<string>[]
    // if L in Output, skip
    ] ? L extends Output[number]
        ? AggregationGenerics<R, Output>
        : AggregationGenerics<R, [...Output, L]>
      : Output

    interface GenericsFuncMap<
      Generics extends readonly t.Generic<string>[],
      Args extends readonly any[] = [],
      RT = void
    > {
      1: <
        T extends t.Infer<Generics[0]['extends']> = Generics[0]['default']
      >(...args: (
        Replace<Args, [
          [Generics[0], T]
        ]> extends infer NArgs extends any[] ? NArgs : []
      )) => Replace<RT, [
        [Generics[0], T]
      ]>
      2: <
        T0 extends t.Infer<Generics[0]['extends']> = Generics[0]['default'],
        T1 extends t.Infer<Generics[1]['extends']> = Generics[1]['default']
      >(...args: (
        Replace<Args, [
          [Generics[0], T0],
          [Generics[1], T1]
        ]> extends infer NArgs extends any[] ? NArgs : []
      )) => Replace<RT, [
        [Generics[0], T0],
        [Generics[1], T1]
      ]>
      3: <
        T0 extends t.Infer<Generics[0]['extends']> = Generics[0]['default'],
        T1 extends t.Infer<Generics[1]['extends']> = Generics[1]['default'],
        T2 extends t.Infer<Generics[2]['extends']> = Generics[2]['default']
      >(...args: (
        Replace<Args, [
          [Generics[0], T0],
          [Generics[1], T1],
          [Generics[2], T2]
        ]> extends infer NArgs extends any[] ? NArgs : []
      )) => Replace<RT, [
        [Generics[0], T0],
        [Generics[1], T1],
        [Generics[2], T2]
      ]>
      4: <
        T0 extends t.Infer<Generics[0]['extends']> = Generics[0]['default'],
        T1 extends t.Infer<Generics[1]['extends']> = Generics[1]['default'],
        T2 extends t.Infer<Generics[2]['extends']> = Generics[2]['default'],
        T3 extends t.Infer<Generics[3]['extends']> = Generics[3]['default']
      >(...args: (
        Replace<Args, [
          [Generics[0], T0],
          [Generics[1], T1],
          [Generics[2], T2],
          [Generics[3], T3]
        ]> extends infer NArgs extends any[] ? NArgs : []
      )) => Replace<RT, [
        [Generics[0], T0],
        [Generics[1], T1],
        [Generics[2], T2],
        [Generics[3], T3]
      ]>
      5: <
        T0 extends t.Infer<Generics[0]['extends']> = Generics[0]['default'],
        T1 extends t.Infer<Generics[1]['extends']> = Generics[1]['default'],
        T2 extends t.Infer<Generics[2]['extends']> = Generics[2]['default'],
        T3 extends t.Infer<Generics[3]['extends']> = Generics[3]['default'],
        T4 extends t.Infer<Generics[4]['extends']> = Generics[4]['default']
      >(...args: (
        Replace<Args, [
          [Generics[0], T0],
          [Generics[1], T1],
          [Generics[2], T2],
          [Generics[3], T3],
          [Generics[4], T4]
        ]> extends infer NArgs extends any[] ? NArgs : []
      )) => Replace<RT, [
        [Generics[0], T0],
        [Generics[1], T1],
        [Generics[2], T2],
        [Generics[3], T3],
        [Generics[4], T4]
      ]>
      6: <
        T0 extends t.Infer<Generics[0]['extends']> = Generics[0]['default'],
        T1 extends t.Infer<Generics[1]['extends']> = Generics[1]['default'],
        T2 extends t.Infer<Generics[2]['extends']> = Generics[2]['default'],
        T3 extends t.Infer<Generics[3]['extends']> = Generics[3]['default'],
        T4 extends t.Infer<Generics[4]['extends']> = Generics[4]['default'],
        T5 extends t.Infer<Generics[5]['extends']> = Generics[5]['default']
      >(...args: (
        Replace<Args, [
          [Generics[0], T0],
          [Generics[1], T1],
          [Generics[2], T2],
          [Generics[3], T3],
          [Generics[4], T4],
          [Generics[5], T5]
        ]> extends infer NArgs extends any[] ? NArgs : []
      )) => Replace<RT, [
        [Generics[0], T0],
        [Generics[1], T1],
        [Generics[2], T2],
        [Generics[3], T3],
        [Generics[4], T4],
        [Generics[5], T5]
      ]>
      [index: number]: (...args: any[]) => any
    }

    export interface ShapeEntries<T, Rest extends any[]> {
      200000: [IsEqual<T, FunctionConstructor>, FunctionConsume<T, Rest>]
      200001: [(
        [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
          IsEqual<T['type'], t.SpecialShapeTypeMapping['generic']>
        ) : false
      ), [T] extends [t.SpecialShape<t.SpecialShapeTypes, any>] ? (
        t.GenericSchema<T['schemas']>
      ) : never]
    }
    export const fn: typeof _fn
    export { fn as function }
    export interface Generic<
      L extends string,
      E extends t.Schema<any, any> = t.Schema<any, any>,
      D extends t.Infer<E> = never
    > {
      label: L
      extends: E
      default: D
    }
    export type GenericSchema<G extends Generic<string>> = t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['generic'], G>, G
    >
    export const generic: typeof _generic

    export interface DynamicSpecialShapeTypeMapping {
      readonly function: typeof functionSymbol
      readonly generic: typeof genericSymbol
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping
        .function]: [readonly t.Schema<any, any>[], t.Schema<any, any>]
      [t.specialShapeTypeMapping
        .generic]: Generic<string, t.Schema<any, any>, any>
    }

    export interface FunctionSchemaFields<Shape, T> {
      /**
       * forward to `{{Schema}}.infer`
       */
      implement(func: T): T
      // TODO args()
      // TODO returns()
      // TODO getter parameters
      // TODO getter returnType
    }
    export interface SchemaFieldsEntries<A = any, B = any, C = any> {10000: [
      (
        & ([A] extends [t.SpecialShape<t.SpecialShapeTypeMapping['function'], any>] ? true : false)
        & IsNotEqual<A, any>
      ), FunctionSchemaFields<A, B>
    ]}
  }
}
