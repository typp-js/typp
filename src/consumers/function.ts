import { IsEqual, Stack } from '../base'
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
    >(label: L, _extends?: E, _default?: D): t.SpecialShape<
      t.SpecialShapeTypeMapping['generic'],
      [Generic<L, E, D>]
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
      [t.specialShapeTypeMapping.function]: [readonly t.Schema<any, any>[], t.Schema<any, any>]
      [t.specialShapeTypeMapping.generic]: [Generic<string, t.Schema<any, any>, any>]
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
      t.TyppT<Args>,
      true extends (
        | IsEqual<Rest, []>
        | IsEqual<Rest, readonly []>
      ) ? t.Schema<typeof t.Symbols.void, void>
        : Typp<Rest>
    ] extends [
      infer ArgsSchemas extends readonly t.Schema<any, any>[],
      infer RestSchema  extends t.Schema<any, any>
    ] ? t.Schema<
        t.SpecialShape<t.SpecialShapeTypeMapping['function'], [ArgsSchemas, RestSchema]>,
        (...args: t.InferT<ArgsSchemas>) => t.Infer<RestSchema>
      >
      : never
  ) : never
)
