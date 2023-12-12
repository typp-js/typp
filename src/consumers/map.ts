import { IsEqual, Stack } from '../base'
import { t, Typp } from '..'
import Schema = t.Schema

declare module '..' {
  namespace t {
    export interface Map<
      KSchema extends Schema<any, any>,
      VSchema extends Schema<any, any>
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
      infer KT extends Schema<any, any>,
      infer VT extends Schema<any, any>
    ] ? t.Schema<t.Map<KT, VT>, Map<t.Infer<KT>, t.Infer<VT>>>
      : never
  ) : never
)
