import { IsEqual } from '../base'
import { t, Typp } from '..'

declare module '..' {
  namespace t {
    export interface Set<S extends t.Schema<any, any>> {
      itemSchema: S
    }
  }
}

export type SetConsume<
  T,
  Rest extends any[]
> = true extends (
  | IsEqual<Rest, []>
  | IsEqual<Rest, readonly []>
) ? (
  t.Schema<
    t.Set<t.Schema<any, any>>,
    Set<any>
  >
) : (
  Typp<Rest> extends infer IT extends t.Schema<any, any>
    ? t.Schema<t.Set<IT>, Set<t.Infer<IT>>>
    : never
)