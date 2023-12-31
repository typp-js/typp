import type { IsEqual, IsNotEqual, IsTrue, Nonexistentable, Pretty, Stack, U2I, ValueOf, WithThis } from './types'
import { completeAssign } from './utils/completeAssign'

const __typp__: unique symbol = Symbol('typp')

export type Typp<T extends readonly any[]> = true extends (
  | IsEqual<T, []>
  | IsEqual<T, readonly []>
) ? t.Schema<any, any> : (
  Stack.Shift<T> extends [infer L, infer Rest extends any[]]
    ? t.ShapeMapping<L, Rest>
    : never
)

const CANT_OVERRIDE = Object.freeze([
  'meta',
  'shape'
] as const)
export function t<const T extends any[]>(...types: T): Typp<T> {
  let shape: any
  for (const consumer of consumers) {
    const result = consumer(...types)
    if (result) {
      if (t.isSchema(result)) return result as Typp<T>

      const [s] = result
      shape = s
      break
    }
  }

  const skm = Object.assign({ [__typp__]: true }, { shape }) as t.Schema<any, any>
  let skmIsFullyDefined = false
  for (const [is, inject] of registers) {
    if (!is(shape)) continue

    // TODO [[Getter]], [[Setter]], Function, Proxy, Class
    //      * [[Getter]]: `t.defineFields(() => ({ get foo() {} }))`
    //      * [[Setter]]: `t.defineFields(() => ({ set foo(value) {} }))`
    let proxySkm = skm
    if (typeof Proxy !== 'undefined') {
      proxySkm = new Proxy(skm, {
        get(target, key, receiver) {
          if (skmIsFullyDefined)
            return Reflect.get(target, key, receiver)

          if (key === 'shape') return shape
          throw new Error(`You can't access the property "${String(key)}" of schema, because the schema is not fully defined`)
        }
      })
    }
    const injectResult = inject(proxySkm)
    if (!injectResult) continue
    if (CANT_OVERRIDE.some(key => Object.hasOwnProperty.call(injectResult, key))) {
      throw new Error(`You can't override the property "${CANT_OVERRIDE.join('", "')}" of schema`)
    }
    completeAssign(skm, injectResult)
  }

  skmIsFullyDefined = true
  return skm as Typp<T>
}

interface SchemaBase<Shape, T> {
  shape: Shape
  meta?: t.SchemaMeta<Shape, T>
}

// Consumer
const consumers = new Set<t.Consumer>()
export namespace t {
  export type Consumer = (...args: any[]) => Nonexistentable<[shape: any] | Schema<any, any>>
  export function defineConsumer(consumer: Consumer) {
    consumers.add(consumer)
    return () => consumers.delete(consumer)
  }
}
// Fields Register
const registers = new Set<readonly [t.IsWhatShape | (() => boolean), t.FieldsInjector | t.AllFieldsInjector]>()
export namespace t {
  export type IsWhatShape<S = any> = (shape: any) => shape is S
  export type FieldsInjector<S = any> = (schema: Schema<S, any>) => Nonexistentable<SchemaFieldsMapping<S>>
  export type AllFieldsInjector<
    SK extends Schema<any, any> = Schema<any, any>
  > = (schema: SK) => Nonexistentable<
    WithThis<Partial<SchemaFieldsAll<SK['shape'], Infer<SK>>>>
  >

  export function defineFields(fields: (
    & Partial<SchemaFieldsAll<any, any>>
    // TODO support `this` type
    //      https://github.com/microsoft/TypeScript/issues/56995
    // & ThisType<Schema<any, any>>
  )): () => void
  export function defineFields(inj: AllFieldsInjector): () => void
  export function defineFields<S>(is: IsWhatShape<S>, inj: FieldsInjector<S>): () => void
  export function defineFields<S>(...args: any[]) {
    if (args.length === 1) {
      const [injectorOrFields] = args as [AllFieldsInjector | Partial<SchemaFieldsAll<any, any>>]
      let injector = injectorOrFields as AllFieldsInjector
      if (typeof injectorOrFields !== 'function') {
        injector = () => injectorOrFields
      }
      const register = [() => true, injector] as const
      registers.add(register)
      return () => registers.delete(register)
    }

    const [is, inj] = args as [IsWhatShape<S>, FieldsInjector<S>]
    const register = [is, inj] as const
    registers.add(register)
    return () => registers.delete(register)
  }
}
// Shape
export namespace t {
  export interface ShapeEntries<T, Rest extends any[]> {
    1: [t.IsSchema<T>, T]
    [key: number & {}]: [boolean, unknown]
  }
  export type ShapeMapping<
    T, Rest extends any[],
    Entries extends ShapeEntries<T, Rest> = ShapeEntries<T, Rest>
  > = ValueOf<{
    [ K in keyof Entries
        as [true] extends [IsTrue<Entries[K & number][0]>] ? K : never
    ]: Entries[K & number][1]
  }>
  export interface DynamicSpecialShapeTypeMapping {
    readonly [key: string]: symbol
  }
  export const specialShapeTypeMapping = {
  } as DynamicSpecialShapeTypeMapping
  export function defineSpecialShapeType<
    T extends keyof DynamicSpecialShapeTypeMapping,
    S extends DynamicSpecialShapeTypeMapping[T]
  >(type: T, symbol: S) {
    specialShapeTypeMapping[type] = symbol
    return () => {
      delete specialShapeTypeMapping[type]
    }
  }
  export interface SpecialShapeSchemaMapping {
    [k: SpecialShapeTypes]: any
  }
  export type SpecialShapeTypeMapping = typeof specialShapeTypeMapping
  export type SpecialShapeTypes = SpecialShapeTypeMapping[keyof SpecialShapeTypeMapping]
  export interface SpecialShape<
    T extends SpecialShapeTypes,
    S extends SpecialShapeSchemaMapping[T] = SpecialShapeSchemaMapping[T]
  > {
    type: T
    schemas: S
  }
  export function specialShape<
    T extends SpecialShapeTypes,
    S extends SpecialShapeSchemaMapping[T],
  >(
    ...[type, schemas]: [S] extends [undefined]
      ? readonly [type: T]
      : readonly [type: T, schemas: S]
  ): SpecialShape<T, S> {
    return { type, schemas } as SpecialShape<T, S>
  }
  export function isSpecialShape(obj: any): obj is SpecialShape<any, any> {
    return obj
      && typeof obj === 'object'
      && typeof obj.type === 'symbol'
      && Object
        .values(specialShapeTypeMapping)
        .includes(obj.type)
  }
}
// Base
export namespace t {
  export interface SchemaMeta<Shape, T> {
  }
  export interface SchemaFieldsEntries<Shape = any, T = any> {
    [key: number & {}]: [boolean, any]
  }
  export type SchemaFieldsMapping<
    Shape = any, T = any,
    Entries extends SchemaFieldsEntries<Shape, T> = SchemaFieldsEntries<Shape, T>
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
  export interface SchemaFieldsAll<Shape, T> {
    // TODO readonly
    // TODO mutable
    // TODO nullable
    // TODO nonNullable
    // TODO required
    // TODO optional
    /**
     * @example
     * ```ts
     * type Foo = string
     * const foo = 'foo' as Foo
     * // You can use `'foo' as string` by `{{Schema}}.infer('foo')`
     * const FooSchema = t(String)
     * const foo = FooSchema.infer('foo')
     * ```
     */
    infer(t: T): T
    // TODO like satisfies
    strictInfer(t: T): T
  }
  export type SchemaFields<Shape, T> =
    & SchemaFieldsMapping<Shape, T>
    & SchemaFieldsAll<Shape, T>

  export type Schema<Shape, T> =
    & SchemaFields<Shape, T>
    & SchemaBase<Shape, T>
    & { [__typp__]: true }
  export type IsSchema<T> = T extends { [__typp__]: true } ? true : false
  export type IsNotSchema<T> = T extends { [__typp__]: true } ? false : true
  export function isSchema(obj: any): obj is Schema<any, any> {
    return obj?.[__typp__] === true
  }
  export function isSchemas(arr: any[]): arr is Schema<any, any>[] {
    return arr.every(isSchema)
  }

  export type Infer<T extends Schema<any, any>> = [T] extends [never]
    ? never
    : [T] extends [Schema<any, infer R>] ? R : never

  export function infer<const T extends any[]>(...t: T) {
    return (obj: Infer<Typp<T>>) => obj
  }

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

  export type TyppI<T> = {
    -readonly [K in keyof T]: t.TyppWhenNotATypp<T[K]>
  }
  export type InferI<T> = {
    [K in keyof T]: [T[K]] extends [infer Field extends t.Schema<any, any>]
      ? t.Infer<Field>
      // TODO maybe should return `R[K]`?
      : never
  }
}
// Extensible
export namespace t {
  export const CANT_REFINE = Object.freeze([
    'defineStatic',
    'defineConsumer',
    'defineFields',
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
  type Refineble = Exclude<keyof typeof t, CantRefine>
  export function defineStatic<K extends Refineble>(
    key: K, value: typeof t[K],
    options: DefineStaticOptions = {}
  ) {
    if ((
      CANT_REFINE as unknown as string[]
    ).includes(key)) {
      throw new Error(`can not refine static field "${key}" for typp, because it is always static`)
    }
    const isExisted = Object.hasOwnProperty.call(t, key)
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
      const isExisted = Object.hasOwnProperty.call(t, key)
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
  // TODO static.alias
  defineStatic.proxy = <
    NK extends Refineble
  >(nativeKey: NK, proxyKey: Exclude<Refineble, NK>) => {
    if (nativeKey === proxyKey as string) {
      throw new Error(`can not refine static field "${proxyKey}" for typp, because the nativeKey and proxyKey are the same`)
    }
    if (!Object.hasOwnProperty.call(t, nativeKey)) {
      throw new Error(`can not refine static field "${proxyKey}" for typp, because the native field "${nativeKey}" is not existed`)
    }
    if ((
      CANT_REFINE as unknown as string[]
    ).includes(proxyKey)) {
      throw new Error(`can not refine static field "${proxyKey}" for typp, because it is always static`)
    }
    const isExisted = Object.hasOwnProperty.call(t, proxyKey)
    if (isExisted) {
      throw new Error(`can not refine static field "${proxyKey}" for typp, because it is existed`)
    }
    Object.defineProperty(t, proxyKey, {
      configurable: true,
      enumerable: true,
      get: () => t[nativeKey],
      set: (value) => { t[nativeKey] = value }
    })
    return () => {
      const isExisted = Object.hasOwnProperty.call(t, proxyKey)
      if (!isExisted)
        return
      Object.defineProperty(t, proxyKey, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: undefined
      })
      delete t[proxyKey]
    }
  }
  // TODO static.pipe
}

t.defineFields({
  infer: t => t,
  strictInfer: t => t
})
t.defineConsumer(first => t.isSpecialShape(first) ? [first] : undefined)
t.defineConsumer(first => t.isSchema(first) ? first : undefined)
