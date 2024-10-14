import type {
  AtLeastOneProperty,
  IsEqual,
  IsTrue,
  Nonexistentable, Pipes,
  Pretty,
  Stack, Switch, SwitchEntries,
  U2I,
  ValueOf
} from './types'
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
  // eslint-disable-next-line no-undef-init
  let shape: unknown = undefined
  let consumerAttachedFields: Record<string, unknown> = {}
  for (const consumer of consumers) {
    const result = consumer(...types)
    if (result) {
      if (t.isSchema(result)) return result as Typp<T>

      const [s, fields] = result
      shape = s
      consumerAttachedFields = fields ?? {}
      break
    }
  }

  const meta = {}
  const skm = Object.assign(
    { [__typp__]: true },
    { shape },
    { meta }
  ) as t.Schema<any, any>
  completeAssign(skm, consumerAttachedFields)
  let skmIsFullyDefined = false
  for (const [is, inject] of registers) {
    if (!is(shape)) continue

    // TODO [[Getter]], [[Setter]], Function, Proxy, Class
    //      * [[Getter]]: `t.useFields(() => ({ get foo() {} }))`
    //      * [[Setter]]: `t.useFields(() => ({ set foo(value) {} }))`
    const proxySkm = new Proxy(skm, {
      get(target, key, receiver) {
        if (skmIsFullyDefined)
          return Reflect.get(target, key, receiver)

        if (key === 'shape') return shape
        throw new Error(`You can't access the property "${String(key)}" of schema, because the schema is not fully defined`)
      }
    })
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
  meta: t.SchemaMeta<Shape, T>
}

// Consumer
const consumers = new Set<t.Consumer>()
/* istanbul ignore next -- @preserve */
export namespace t {
  export type Consumer = (...args: any[]) => Nonexistentable<
    | [shape: any, fileds?: Record<string, unknown>]
    | Schema<any, any>
  >
  export function useConsumer(consumer: Consumer) {
    consumers.add(consumer)
    return () => consumers.delete(consumer)
  }
}
// Fields Register
const registers = new Set<readonly [t.IsWhatShape | (() => boolean), t.FieldsInjector | t.AllFieldsInjector]>()
/* istanbul ignore next -- @preserve */
export namespace t {
  export type IsWhatShape<S = any> = (shape: any) => shape is S
  export type FieldsInjector<S = any> = (schema: Schema<S, any>) => Nonexistentable<SchemaFieldsMapping<S>>
  export type AllFieldsInjector<
    SK extends Schema<any, any> = Schema<any, any>
  > = (schema: SK) => Nonexistentable<
    & Partial<SchemaFieldsAll<SK['shape'], Infer<SK>>>
    & ThisType<SK>
  >

  export function useFields(fields: (
    // TODO No `AtLeastOneProperty` for next line
    //      https://github.com/microsoft/TypeScript/issues/56995
    & AtLeastOneProperty<SchemaFieldsAll<any, any>>
    & ThisType<Schema<any, any>>
  )): () => void
  export function useFields(inj: AllFieldsInjector): () => void
  export function useFields<S>(is: IsWhatShape<S>, inj: FieldsInjector<S>): () => void
  export function useFields<S>(...args: any[]) {
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
/* istanbul ignore next -- @preserve */
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
    readonly [key: string & {}]: symbol
  }
  export const specialShapeTypeMapping = {
  } as DynamicSpecialShapeTypeMapping
  export function useSpecialShapeType<
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
  export function isWhatSpecialShape<
    T extends keyof t.SpecialShapeTypeMapping
  >(type: T, s: t.Schema<any, any>): s is t.Schema<
    t.SpecialShape<t.SpecialShapeTypeMapping[T], readonly t.Schema<any, any>[]>,
    any
  > {
    if (!s.shape) return false
    if (!s.shape.type) return false
    return s.shape.type === t.specialShapeTypeMapping[type]
  }
  export type IsSpecialShape<
    Shape,
    K extends keyof t.SpecialShapeTypeMapping,
    T extends t.SpecialShapeTypeMapping[K] = t.SpecialShapeTypeMapping[K]
  > = Shape extends SpecialShape<T, SpecialShapeSchemaMapping[T]> ? true : false
  export type InferSpecialShapeSchemas<
    T,
    K extends keyof t.SpecialShapeTypeMapping
  > = T extends SpecialShape<any, infer S> ? S : never
}
// Base
/* istanbul ignore next -- @preserve */
export namespace t {
  export interface SchemaMeta<Shape, T> {
    [k: string | number | symbol]: any
  }
  export interface SchemaFieldsEntries<Shape = any, T = any> extends SwitchEntries {
  }
  export type SchemaFieldsMapping<
    Shape = any, T = any,
    Entries extends SwitchEntries = SchemaFieldsEntries<Shape, T>
  > = Pretty<U2I<Switch<Entries>>>
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
  export function clone(skm: Schema<any, any>) {
    const meta = {} as Record<string | number | symbol, any>
    const skmMeta = skm.meta ?? {}
    const allFieldKeys = (
      Object.keys(skmMeta) as (string | symbol)[]
    ).concat(
      Object.getOwnPropertySymbols(skmMeta)
    )
    for (const key of allFieldKeys) {
      const field = skmMeta[key]
      if (typeof field !== 'function') {
        let nField = field
        if (typeof field === 'object' && field !== null) {
          if (nField[instanceUseClone]) {
            nField = nField[instanceUseClone]()
          } else {
            nField = Object.assign(Array.isArray(field) ? [] : {}, field)
          }
        }
        meta[key] = nField
        continue
      }
      meta[key] = skmMeta[key]
    }
    return Object.assign(completeAssign({}, skm), { meta })
  }
}
// `use` Support
const utils = {} as t.ResolverUtils
const instanceUseClone = Symbol('clone')
/* istanbul ignore next -- @preserve */
export namespace t {
  export interface Resolver<
    S extends Schema<any, any> = Schema<any, any>, RT = S
  > {
    (schema: S): RT
  }
  export interface ResolverUtils {
    [key: string & {}]: (...args: any[]) => Resolver
  }
  export function defineResolver<R extends Resolver>(func: R): R {
    return func
  }
  export interface UseResolverOptions {
    /**
     * if `true`, will override the existed resolver.
     * else, will throw an error when override the existed resolver.
     *
     * @default false
     */
    override?: boolean
  }
  export function useResolver<K extends keyof ResolverUtils>(
    key: K, resolver: ResolverUtils[K], options: UseResolverOptions = {}
  ) {
    if (typeof resolver !== 'function') {
      throw new TypeError(`You can't use resolver for typp, because the resolver "${key}" is not a function`)
    }
    const isExisted = Object.hasOwnProperty.call(utils, key)
    if (isExisted && !options.override) {
      throw new Error(`You can't use resolver for typp, because the resolver "${key}" is existed and if you want to override it, please set the option "override" to true`)
    }
    utils[key] = resolver
    return () => {
      delete utils[key]
    }
  }
  export function defineCloneMetaField<T>(obj: T, cloneFn: () => T) {
    Object.defineProperty(obj, instanceUseClone, {
      configurable: false, enumerable: false, writable: false,
      value: () => defineCloneMetaField(cloneFn(), cloneFn)
    })
    return obj
  }
  export interface SchemaFieldsAll<Shape, T> {
    /**
     * @example
     * ```ts
     * t(String)
     *   .use(range(5, 10))
     * t(String)
     *   .use(range.max(10))
     *   .use(range.min(5))
     * t(String)
     *   .use(label('Foo String'))
     *   .use(describe('start with foo'))
     *   .use(test(/^foo/))
     * t(String)
     *   .use(
     *     test(/^foo/),
     *     label('Foo String'),
     *     describe('start with foo')
     *   )
     * ```
     * @example
     * ```ts
     * t(String)
     *   .use('test', /^foo/)
     *   .use('label', 'Foo String')
     *   .use('describe', 'start with foo')
     * ```
     */
    use:
      & Pipes<t.Schema<Shape, T>>
      & (
        <K extends keyof ResolverUtils>(
          key: K, ...args: Parameters<ResolverUtils[K]>
        ) => ReturnType<ReturnType<ResolverUtils[K]>>
      )
  }
}
// Extensible
/* istanbul ignore next -- @preserve */
export namespace t {
  export const CANT_REFINE = Object.freeze([
    'use',
    'useStatic',
    'useConsumer',
    'useFields',
    'useSpecialShapeType',
    'useResolver',
    'defineResolver',
    'isSchema',
    'isSchemas',
    'isSpecialShape',
    'isWhatSpecialShape',
    'CANT_REFINE'
  ] as const)
  export type CantRefine = typeof CANT_REFINE[number]
  export interface UseStaticOptions {
    /**
     * if `true`, will override the existed static function.
     * else, will throw an error when override the existed static function.
     *
     * @default false
     */
    override?: boolean
  }
  export type Refineble = Exclude<keyof typeof t, CantRefine>
  export function useStatic<K extends Refineble>(
    key: K, value: typeof t[K],
    options: UseStaticOptions = {}
  ) {
    if ((
      CANT_REFINE as unknown as string[]
    ).includes(key)) {
      throw new Error(`You can't refine static field "${key}" for typp, because it is always static`)
    }
    const isExisted = Object.hasOwnProperty.call(t, key)
    if (isExisted && !options.override) {
      throw new Error(`You can't refine static field "${key}" for typp, because it is existed and if you want to override it, please set the option "override" to true`)
    }
    Object.defineProperty(t, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    })
    return () => {
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
  useStatic.proxy = <
    NK extends keyof typeof t
  >(nativeKey: NK, proxyKey: Exclude<Refineble, NK>) => {
    const errorMsgPrefix = `You can't refine static field "${proxyKey}" to "${nativeKey}" for typp`
    if (nativeKey === proxyKey as string) {
      throw new Error(`${errorMsgPrefix}, because the nativeKey and proxyKey are the same`)
    }
    if (!Object.hasOwnProperty.call(t, nativeKey)) {
      throw new Error(`${errorMsgPrefix}, because the native field "${nativeKey}" is not existed`)
    }
    if ((
      CANT_REFINE as unknown as string[]
    ).includes(proxyKey)) {
      throw new Error(`${errorMsgPrefix}, because it is always static`)
    }
    const isExisted = Object.hasOwnProperty.call(t, proxyKey)
    if (isExisted) {
      throw new Error(`${errorMsgPrefix}, because it is existed`)
    }
    Object.defineProperty(t, proxyKey, {
      configurable: true,
      enumerable: true,
      get: () => t[nativeKey],
      set: (value) => { t[nativeKey] = value }
    })
    return () => {
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
  export function use(plugin: (ctx: typeof t) => (() => void) | void) {
    // TODO support (() => Awaitable<void>)[]
    const disposes = [] as (() => void)[]
    const tWatcher = new Proxy(t, {
      get(target, key: keyof typeof t, receiver) {
        const field = Reflect.get(target, key, receiver)
        // noinspection SuspiciousTypeOfGuard
        if (
          typeof key === 'symbol'
          || !key.startsWith('use')
          || typeof field !== 'function'
        ) return field

        return new Proxy(field, {
          get(target, fieldKey, receiver) {
            const field = Reflect.get(target, fieldKey, receiver)
            if (typeof field !== 'function') return field
            return new Proxy(field, {
              apply(target, thisArg, args) {
                const dispose = Reflect.apply(target, thisArg, args) as () => void
                if (typeof dispose !== 'function')
                  throw new Error(`The return value of t.${key}.${fieldKey.toString()} is not a function`)

                disposes.push(dispose)
                return dispose
              }
            })
          },
          apply(target, thisArg, args) {
            const dispose = Reflect.apply(target, thisArg, args)
            if (typeof dispose !== 'function')
              throw new Error(`The return value of t.${key} is not a function`)

            disposes.push(dispose)
            return dispose
          }
        })
      }
    })
    const pluginDispose = plugin(tWatcher)
    return () => {
      for (const dispose of disposes) {
        dispose()
      }
      pluginDispose?.()
    }
  }
}

t.useFields({
  infer: t => t,
  strictInfer: t => t,
  use(first: any, ...rest: any[]) {
    if (typeof first === 'function') {
      return rest.reduce(
        (acc, func) => func(acc),
        first(t.clone(this))
      )
    }
    if (typeof first === 'string') {
      if (!(first in utils))
        throw new Error(`You can't use "${first}" for schema, because it is not in \`ResolverUtils\``)
      const fn = utils[first]
      return fn.call(
        this,
        ...rest
      )(t.clone(this))
    }
    throw new Error(`You can't use "${first}" for schema, because it is not a function or string`)
  }
})
t.useConsumer(first => t.isSpecialShape(first) ? [first] : undefined)
t.useConsumer(first => t.isSchema(first) ? first : undefined)

export * from './types'
