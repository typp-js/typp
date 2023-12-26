import type { t } from '../base'
import type { IsEqual, Stack, UseWhenNoNever, ValueOf } from '../types'

declare module '../base' {
  namespace t {
    export interface ShapeEntries<T, Rest extends any[]> {
      [key: number & {}]: [boolean, t.Schema<any, any>]
    }
  }
}

type ShapeMapping<
  T, Rest extends any[],
  Entries extends t.ShapeEntries<T, Rest> = t.ShapeEntries<T, Rest>
> = ValueOf<{
  [ K in keyof Entries
      as true extends (
        IsEqual<Entries[K & number][0], true>
      ) ? K : never
  ]: Entries[K & number][1]
}>

export type Consumer<
  T extends readonly any[]
> = Stack.Shift<T> extends [infer L, infer Rest extends any[]]
  // TODO simplify code
  ? UseWhenNoNever<
      ShapeMapping<L, Rest>,
      [L] extends [t.Schema<any, any>] ? L : never
    >
  : never

export * from './array'
export * from './calc'
export * from './function'
export * from './map'
export * from './object'
export * from './primitive'
export * from './set'
