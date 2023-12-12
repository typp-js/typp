import { IsEqual, Stack } from '../base'
import { t, Typp } from '..'

declare module '..' {
  namespace t {
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
