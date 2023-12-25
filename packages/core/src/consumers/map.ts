import type { t, Typp } from '..'
import type { IsEqual, Stack } from '../types'

declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      111000: [IsEqual<T, MapConstructor>, MapConsume<T, Rest>]
    }
    export interface Map<
      KSchema extends t.Schema<any, any>,
      VSchema extends t.Schema<any, any>
    > {
      kSchema: KSchema
      vSchema: VSchema
    }
  }
}

export type MapConsume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<Rest, []>
  | IsEqual<Rest, readonly []>
) ? (
  t.Schema<
    t.Map<t.Schema<any, any>, t.Schema<any, any>>,
    Map<any, any>
  >
) : (
  Stack.Shift<Rest> extends [
    infer L,
    infer Rest extends any[]
  ] ? (
    [Typp<[L]>, Typp<Rest>] extends [
      infer KT extends t.Schema<any, any>,
      infer VT extends t.Schema<any, any>
    ] ? t.Schema<t.Map<KT, VT>, Map<t.Infer<KT>, t.Infer<VT>>>
      : never
  ) : never
)
