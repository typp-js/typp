import type { Typp } from '..'
import { t } from '..'
import type { IsEqual } from '../types'

declare module '@typp/core' {
  namespace t {
    export function array<const T extends readonly any[]>(...types: T): Typp<[ArrayConstructor, ...T]>
    export function tuple<const T extends readonly any[]>(...types: T): Typp<[T]>
  }
}
t.defineStatic('array', <T extends readonly any[]>() => <Typp<[ArrayConstructor, ...T]>>({}))
t.defineStatic('tuple', <T extends readonly any[]>() => <Typp<[T]>>({}))

export type ArrayConsume<
  T,
  Rest extends any[]
> = true extends (
  & (
    | IsEqual<Rest, []>
    | IsEqual<Rest, readonly []>
  )
  & (
    | IsEqual<T, []>
    | IsEqual<T, readonly []>
  )
) ? t.Schema<[], []>
  : t.Schema<Typp<Rest>[], t.Infer<Typp<Rest>>[]>
