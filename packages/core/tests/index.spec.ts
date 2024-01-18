import { describe, expect, expectTypeOf, test } from 'vitest'

import type { Typp } from '../src'
import { t } from '../src'

describe('infer', () => {
  test('static', () => {
    const defineNumber = t.infer(t(Number))
    const number1 = defineNumber(1)
    expect(number1).toBe(1)
    expectTypeOf<typeof number1>().toEqualTypeOf<number>()
    // @ts-expect-error
    defineNumber('1')

    const defineNumberArray = t.infer(t.array(Number))
    const numberArray = defineNumberArray([1])
    expect(numberArray).toEqual([1])
    expectTypeOf<typeof numberArray>().toEqualTypeOf<number[]>()
    // @ts-expect-error
    defineNumberArray(['1'])

    const defineFunction = t.infer(t(Function, [Number], Number))
    const func = defineFunction(a => a)
    expect(func(1)).toBe(1)
    expectTypeOf<typeof func>().toEqualTypeOf<(a: number) => number>()
    // @ts-expect-error
    defineFunction(a => String(a))

    const defineGenericFunction = t.infer(t(Function, [t.generic('T')], t.generic('T')))
    const genericFunc = defineGenericFunction(a => a)
    const f0 = genericFunc(1)
    const f1 = genericFunc('1')
    expect(f0).toBe(1)
    expect(f1).toBe('1')
    expectTypeOf<typeof f0>().toEqualTypeOf<1>()
    expectTypeOf<typeof f1>().toEqualTypeOf<'1'>()
    // @ts-expect-error
    defineGenericFunction(a => String(a))

    // Can't check `GenericFunction` is equal to `<T extends any = never>(args_0: T) => T`,
    // maybe because of the generic magic type-level function.

    // type GenericFunc = <T extends any = never>(args_0: T) => T
    // type GenericFuncTypeof = typeof genericFunc
    // //   ^?
    // type T0 = [GenericFuncTypeof] extends [GenericFunc] ? true : false
    // //   ^?
    // type T1 = IsEqual<GenericFunc, GenericFuncTypeof>
    // //   ^?
    // type T2 = IsEqual<<T extends any = never>(args_0: T) => T, <T extends any = never>(args_0: T) => T>
    // //   ^?
    // expectTypeOf<GenericFunc>().toEqualTypeOf<GenericFuncTypeof>()
    // expectTypeOf(genericFunc).toEqualTypeOf<GenericFunc>()
  })
  test('passing schema and rerun itself', () => {
    const number = t(t(Number))
    expectTypeOf<typeof number>().toEqualTypeOf<t.Schema<NumberConstructor, number>>()
  })
  test('instance method', () => {
    const NumberSchema = t(Number)
    const number0 = NumberSchema.infer(0)
    expect(number0).toBe(0)
    expectTypeOf<typeof number0>().toEqualTypeOf<number>()
    // @ts-expect-error
    NumberSchema.infer('0')

    const literal0 = t(1)
    const number1 = literal0.infer(1)
    expect(number1).toBe(1)
    expectTypeOf<typeof number1>().toEqualTypeOf<1>()
    // @ts-expect-error
    literal0.infer(0)
    // @ts-expect-error
    literal0.infer('0')
  })
})

declare module '@typp/core' {
  namespace t {
    export const ____test_useStaticField0: string
    export const ____test_useStaticField1: string
    export const use_test: number
  }
}

describe('use', () => {
  test('base', () => {
    type tNamespace = typeof t
    const dispose = t.use(ctx => {
      const t = ctx
      expectTypeOf(t).toEqualTypeOf<tNamespace>()
      t.useStatic('____test_useStaticField0', '1')
      t.useStatic('____test_useStaticField1', '2')
    })
    expect(t.____test_useStaticField0).toBe('1')
    expect(t.____test_useStaticField1).toBe('2')
    dispose()
    expect(t).not.toHaveProperty('____test_useStaticField0')
    expect(t).not.toHaveProperty('____test_useStaticField1')
  })
  test('modifier', () => {
    const dispose = t.use(ctx => {
      const t = ctx
      t.useStatic('____test_useStaticField0', '1')
      t.useStatic.proxy('____test_useStaticField0', '____test_useStaticField1')
    })
    expect(t.____test_useStaticField0).toBe('1')
    expect(t.____test_useStaticField1).toBe('1')
    dispose()
    expect(t).not.toHaveProperty('____test_useStaticField0')
    expect(t).not.toHaveProperty('____test_useStaticField1')
  })
  test('throw error when useWhat is not a function', () => {
    const disposeStatic = t.useStatic('use_test', 1)
    expect(() => {
      t.use(ctx => {
        // @ts-expect-error
        ctx.use_test()
      })
    }).toThrow('You can\'t use plugin for typp, because the field "use_test" is not a function')
    disposeStatic()
  })
  test('nested use', () => {
    const dispose = t.use(ctx => {
      ctx.useStatic('____test_useStaticField0', '1')
      ctx.use(ctx => {
        ctx.useStatic('____test_useStaticField1', '2')
      })
    })
    expect(t.____test_useStaticField0).toBe('1')
    expect(t.____test_useStaticField1).toBe('2')
    dispose()
    expect(t).not.toHaveProperty('____test_useStaticField0')
    expect(t).not.toHaveProperty('____test_useStaticField1')
  })
})

declare module '../src/base' {
  namespace t {
    export interface ResolverUtils {
      ____test_regResolver: (reg: RegExp) => t.Resolver<t.Schema<StringConstructor, string>>
      ____test_dialog: () => t.Resolver<t.Schema<StringConstructor, string>>
      ____test_castToNum: () => t.Resolver<t.Schema<any, any>, t.Schema<NumberConstructor, number>>
    }
  }
}

describe('instance.use', () => {
  test('defineResolver', () => {
    const test = (reg: RegExp) => t.defineResolver((skm: Typp<[StringConstructor]>) => {
      // @ts-ignore
      skm.meta.reg = reg
      return skm
    })
    const t0 = test(/.*/)

    const withT0 = t0(t.string())
    expectTypeOf(withT0)
      .toEqualTypeOf<Typp<[StringConstructor]>>()
    // @ts-ignore
    const reg = withT0.meta?.reg as RegExp
    expect(reg.source).toBe('.*')
  })
  test('base', () => {
    const test = (reg: RegExp) => t.defineResolver((skm: Typp<[StringConstructor]>) => {
      // @ts-ignore
      skm.meta.reg = reg
      return skm
    })
    const skm = t.string().use(test(/.*/))
    expectTypeOf(skm).toEqualTypeOf<Typp<[StringConstructor]>>()
    // @ts-ignore
    const reg = skm.meta?.reg as RegExp
    expect(reg.source).toBe('.*')

    const castToNumSkm = t.defineResolver(skm => skm as Typp<[NumberConstructor]>)
    const numSkm = t.string().use(castToNumSkm)
    expectTypeOf(numSkm).toEqualTypeOf<Typp<[NumberConstructor]>>()
  })
  test('utils key', () => {
    const dispose = t.useResolver('____test_regResolver', reg => skm => {
      expectTypeOf(reg).toEqualTypeOf<RegExp>()
      expectTypeOf(skm).toEqualTypeOf<Typp<[StringConstructor]>>()
      // @ts-ignore
      skm.meta.reg = reg
      return skm
    })
    const skm = t.string().use('____test_regResolver', /.*/)
    expectTypeOf(skm).toEqualTypeOf<Typp<[StringConstructor]>>()
    // @ts-ignore
    const reg = skm.meta?.reg as RegExp
    expect(reg.source).toBe('.*')
    dispose()

    const dispose2 = t.useResolver('____test_dialog', () => skm => skm)
    const skm2 = t.string().use('____test_dialog')
    expectTypeOf(skm2).toEqualTypeOf<Typp<[StringConstructor]>>()
    dispose2()

    const dispose3 = t.useResolver('____test_castToNum', () => skm => skm as Typp<[NumberConstructor]>)
    const skm3 = t.string().use('____test_castToNum')
    expectTypeOf(skm3).toEqualTypeOf<Typp<[NumberConstructor]>>()
    dispose3()
  })
  // TODO unit test key mode
  test('useResolver', () => {
    const dispose = t.useResolver('____test_regResolver', (reg: RegExp) => t.defineResolver((skm: Typp<[StringConstructor]>) => {
      // @ts-ignore
      skm.meta.reg = reg
      return skm
    }))
    const skm = t.string().use('____test_regResolver', /.*/)
    // @ts-ignore
    const reg = skm.meta?.reg as RegExp
    expect(reg.source).toBe('.*')
    dispose()
    expect(() => {
      t.string().use('____test_regResolver', /.*/)
    }).toThrow('____test_regResolver is not a function')
  })
  test('throw error for useResolver', () => {
    expect(() => {
      t.string().use('____test_regResolver', /.*/)
    }).toThrow('____test_regResolver is not a function')
    const dispose = t.useResolver('____test_regResolver', (reg: RegExp) => t.defineResolver(skm => skm))
    expect(() => {
      t.useResolver('____test_regResolver', (reg: RegExp) => t.defineResolver(skm => skm))
    }).toThrow('You can\'t use resolver for typp, because the resolver "____test_regResolver" is existed and if you want to override it, please set the option "override" to true')
    dispose()
    expect(() => {
      t.useResolver(
        '____test_regResolver',
        // @ts-expect-error
        '123'
      )
    }).toThrow('You can\'t use resolver for typp, because the resolver "____test_regResolver" is not a function')
  })
})
