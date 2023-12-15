import { IsEqual, Stack } from '../base'
import { t, Typp } from '..'

const functionSymbol = Symbol('function')
declare module '..' {
  namespace t {
    export function fn<
      const Args extends readonly any[],
      RT extends any = void
    >(args: Args, rt?: RT): Typp<[FunctionConstructor, Args, RT]>
    export type Generic<L, E, D> = {
      label: L
      extends: E
      default: D
    }
    export function generic<const L, E, D = never>(label: L, _extends?: E, _default?: D): Generic<L, E, D>

    type Replace<T, U extends any[]> = U extends [infer A, ...infer B]
      ? A extends Generic<any, any, any>
        ? [T, ...Replace<T, B>]
        : [A, ...Replace<T, B>]
      : []
    interface DynamicSpecialShapeTypeMapping {
      readonly function: typeof functionSymbol
    }
    export interface SpecialShapeSchemaMapping {
      [t.specialShapeTypeMapping.function]: [readonly t.Schema<any, any>[], t.Schema<any, any>]
    }
  }
}
t.defineSpecialShapeType('function', functionSymbol)

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
