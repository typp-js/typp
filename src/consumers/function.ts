import { Collect, IsEqual, Stack } from '../base'
import { t, Typp } from '..'

const functionSymbol = Symbol('function')
const genericSymbol = Symbol('generic')
declare module '..' {
  namespace t {
    export function fn<
      const Args extends readonly any[],
      RT extends readonly any[] = []
    >(args: Args, ...rt: RT): Typp<[FunctionConstructor, Args, ...RT]>
    export interface Generic<
      L extends string,
      E extends t.Schema<any, any> = t.Schema<any, any>,
      D extends t.Infer<E> = never
    > {
      label: L
      extends: E
      default: D
    }
    export function generic<
      const L extends string,
      E extends t.Schema<any, any> = t.Schema<any, any>,
      D extends t.Infer<E> = never
    >(label: L, _extends?: E, _default?: D): t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['generic'],
        Generic<L, E, D>
      >,
      t.SpecialShapeTypeMapping['generic']
    >

    type Replace<T, U extends any[]> = U extends [infer A, ...infer B]
      ? A extends Generic<any, any, any>
        ? [T, ...Replace<T, B>]
        : [A, ...Replace<T, B>]
      : []
    interface DynamicSpecialShapeTypeMapping {
      readonly function: typeof functionSymbol
      readonly generic: typeof genericSymbol
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping
        .function]: [readonly t.Schema<any, any>[], t.Schema<any, any>]
      [t.specialShapeTypeMapping
        .generic]: Generic<string, t.Schema<any, any>, any>
    }
  }
}
t.defineSpecialShapeType('function', functionSymbol)
t.defineSpecialShapeType('generic', genericSymbol)

export type FunctionConsume<
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
      // TODO resolve generic
      Collect<Args, t.Generic<string>>,
      t.TyppT<Args>,
      true extends (
        | IsEqual<Rest, []>
        | IsEqual<Rest, readonly []>
      ) ? t.Schema<typeof t.Symbols.void, void>
        : Typp<Rest>
    ] extends [
      infer Generics    extends readonly t.Generic<string>[],
      infer ArgsSchemas extends readonly t.Schema<any, any>[],
      infer RestSchema  extends t.Schema<any, any>
    ] ? (
      AggregationGenerics<Generics> extends infer AGenerics extends readonly t.Generic<string>[] ? (
          t.Schema<
            t.SpecialShape<t.SpecialShapeTypeMapping['function'], [ArgsSchemas, RestSchema]>,
            AGenerics['length'] extends 0 ? (
              (...args: t.InferT<ArgsSchemas>) => t.Infer<RestSchema>
            ) : (
              // AGenerics
              GenericsFuncMap<AGenerics, t.InferT<ArgsSchemas>, t.Infer<RestSchema>>[Generics['length']]
            )
          >
      ) : never
    ) : never
  ) : never
)

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
  RT extends any = void
> {
  1: <
    T extends t.Infer<Generics[0]['extends']> = Generics[0]['default']
  >(...args: Args) => RT
  2: <
    T0 extends t.Infer<Generics[0]['extends']> = Generics[0]['default'],
    T1 extends t.Infer<Generics[1]['extends']> = Generics[1]['default']
  >(...args: Args) => RT
  3: <
    T0 extends t.Infer<Generics[0]['extends']> = Generics[0]['default'],
    T1 extends t.Infer<Generics[1]['extends']> = Generics[1]['default'],
    T2 extends t.Infer<Generics[2]['extends']> = Generics[2]['default']
  >(...args: Args) => RT
  [index: number]: (...args: Args) => RT
}
