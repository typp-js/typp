import { IsEqual } from '../types'
import { t, Typp } from '../index'

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
