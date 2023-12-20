import './calc'

import type { Consumer } from './comsumer'
import type { IsEqual, IsNotEqual, Pretty, U2I, ValueOf } from './types'

export type Typp<T extends readonly any[]> = true extends (
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? t.Schema<any, any> : Consumer<T>

export function t<const T extends any[]>(...t: T): Typp<T> {
  return {} as Typp<T>
}
export { t as typp }

export namespace t {
  export interface DynamicSpecialShapeTypeMapping {
    readonly [key: string]: symbol
  }
  export const specialShapeTypeMapping = {
  } as DynamicSpecialShapeTypeMapping
  export function defineSpecialShapeType<
    T extends keyof DynamicSpecialShapeTypeMapping,
    S extends DynamicSpecialShapeTypeMapping[T]
  >(type: T, symbol: S): void {
    specialShapeTypeMapping[type] = symbol
  }
  export interface SpecialShapeSchemaMapping {
    [k: SpecialShapeTypes]: any
  }
  export type SpecialShapeTypeMapping = typeof specialShapeTypeMapping
  export type SpecialShapeTypes = SpecialShapeTypeMapping[keyof SpecialShapeTypeMapping]
  export interface SpecialShape<
    T extends SpecialShapeTypes,
    S extends SpecialShapeSchemaMapping[T]
  > {
    type: T
    schemas: S
  }
  export interface SchemaMeta<Shape, T> {
  }
  export interface SchemaMethodsEntries<A = any, B = any, C = any> {
    [key: number & {}]: [boolean, any]
  }
  export type SchemaMethodsMapping<
    A = any, B = any, C = any,
    Entries extends SchemaMethodsEntries<A, B, C> = SchemaMethodsEntries<A, B, C>
  > = [keyof Entries] extends [infer Keys extends number] ? Pretty<U2I<
    ValueOf<{
      [ K in Keys
        as true extends (
          & Entries[K][0]
          & IsNotEqual<K, number & {}>
        ) ? K : never
      ]: Entries[K][1]
    }> extends infer R
      ? [R] extends [never] ? {} : R
      : never
  >> : {}
  export interface SchemaMethodsAll<Shape, T> {
    // TODO readonly
    // TODO mutable
    // TODO nullable
    // TODO nonNullable
    // TODO required
  }
  export type SchemaMethods<Shape, T> =
    & SchemaMethodsMapping<Shape, T>
    & SchemaMethodsAll<Shape, T>
  export interface SchemaFields<Shape, T> {
    shape: Shape
    meta: SchemaMeta<Shape, T>
  }

  export type Schema<Shape, T> =
    & SchemaFields<Shape, T>
    & SchemaMethods<Shape, T>
  export type Infer<T extends Schema<any, any>> = [T] extends [never]
    ? never
    : [T] extends [Schema<any, infer R>] ? R : never

  export type TyppWhenNotATypp<T> = [T] extends [Schema<any, any>] ? T : Typp<[T]>
  // make every item of `union` type which wrapped `Typp` for getting `Schema`
  export type Typps<T> = T extends infer Item ? TyppWhenNotATypp<Item> : never
  // infer type from every item of `union` type
  export type Infers<T> = T extends (
    infer Item extends Schema<any, any>
  ) ? Infer<Item> : never

  // make every item of `tuple` type which wrapped `Typp` for getting `Schema`
  export type TyppT<T extends readonly any[]> = T extends readonly [
    infer Item, ...infer Rest extends any[]
  ] ? (
    [TyppWhenNotATypp<Item>, ...TyppT<Rest>]
  ) : []
  // infer type from every item of `tuple` type
  export type InferT<T extends readonly Schema<any, any>[]> = T extends readonly [
    infer Item extends Schema<any, any>,
    ...infer Rest extends readonly Schema<any, any>[]
  ] ? (
    [Infer<Item>, ...InferT<Rest>]
  ) : []
}
// Extensible
export namespace t {
  export const CANT_REFINE = Object.freeze([
    'defineStatic',
    'defineSpecialShapeType',
    'CANT_REFINE'
  ] as const)
  type CantRefine = typeof CANT_REFINE[number]
  export interface DefineStaticOptions {
    /**
     * if `true`, will override the existed static function.
     * else, will throw an error when override the existed static function.
     *
     * @default false
     */
    override?: boolean
  }
  export function defineStatic<
    K extends Exclude<keyof typeof t, CantRefine>,
    V extends typeof t[K]
  >(key: K, value: V, options: DefineStaticOptions = {}) {
    if ((
      CANT_REFINE as unknown as string[]
    ).includes(key)) {
      throw new Error(`can not refine static field "${key}" for typp, because it is always static`)
    }
    const isExisted = Object.prototype.hasOwnProperty.call(t, key)
    if (isExisted && !options.override) {
      throw new Error(`can not refine static field "${key}" for typp, because it is existed and if you want to override it, please set the option "override" to true`)
    }
    Object.defineProperty(t, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    })
    return () => {
      const isExisted = Object.prototype.hasOwnProperty.call(t, key)
      if (!isExisted || t[key] !== value)
        return
      Object.defineProperty(t, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: undefined
      })
      delete t[key]
    }
  }
}
