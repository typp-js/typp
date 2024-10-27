import { t, type Typp } from '@typp/core/base'

import { describe, expect, expectTypeOf, test, vi } from 'vitest'

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
describe('strictInfer', () => {
  test('instance method', () => {
    const NumberSchema = t(Number)
    const number0 = NumberSchema.strictInfer(0)
    expect(number0).toBe(0)
    // TODO type check
  })
})

test('isSchema', () => {
  expect(t.isSchema(t())).toBe(true)
  expect(t.isSchema(t(Number))).toBe(true)
  expect(t.isSchema({})).toBe(false)
  expect(t.isSchemas([t(), t(Number)])).toBe(true)
  expect(t.isSchemas([t(), {}])).toBe(false)
})
test('isWhatSpecialShape', () => {
  expect(t.isWhatSpecialShapeSkm('any', t())).toBe(true)
  expect(t.isWhatSpecialShapeSkm('any', t(Number))).toBe(false)
  expect(t.isWhatSpecialShapeSkm(
    'any',
    // @ts-expect-error
    {}
  )).toBe(false)
  expect(t.isWhatSpecialShapeSkm(
    'any',
    // @ts-expect-error
    { shape: {} }
  )).toBe(false)
  expect(t.isWhatSpecialShapeSkm(
    'any',
    // @ts-expect-error
    {}
  )).toBe(false)
  expect(t.isWhatSpecialShapeSkm(
    'any',
    // @ts-expect-error
    { shape: { type: undefined } }
  )).toBe(false)
})

declare module '@typp/core/base' {
  namespace t {
    export const ____test_useStaticField0: string
    export let ____test_useStaticField1: string
    export const use_test: () => number
    export const use_testWithFields: {
      foo: () => number
      bar: string
      bor: { a: number }
      (): () => void
    }
    export function use_testFunction(): () => void
    export interface ____use_testFunctionWithFields {
      foo: number
      (): () => void
    }
    export const use_testFunctionWithFields: ____use_testFunctionWithFields
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
  test('throw error when return value of useWhat is not a function', () => {
    const disposeStatic = t.useStatic('use_test', () => 1)
    expect(() => {
      t.use(ctx => {
        ctx.use_test()
      })
    }).toThrow('The return value of t.use_test is not a function')
    disposeStatic()
  })
  test('throw error when field return value of return value of useWhat is not a function', () => {
    const fooFn = vi.fn()
    const bar = '1'
    const bor = { a: 1 }
    const disposeStatic = t.useStatic(
      'use_testWithFields',
      Object.assign(() => () => void 0, {
        foo: fooFn,
        bar,
        bor
      })
    )
    expect(() => {
      t.use(ctx => {
        ctx.use_testWithFields.foo()
      })
    }).toThrow('The return value of t.use_testWithFields.foo is not a function')
    t.use(ctx => {
      // Proxy will change the reference of function
      expect(ctx.use_testWithFields.foo).not.toBe(fooFn)
      // But not change the reference of other fields
      expect(ctx.use_testWithFields.bar).toBe(bar)
      expect(ctx.use_testWithFields.bor).toBe(bor)
    })
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
  test('use custom useWhat', () => {
    const mockFn = vi.fn()
    const dispose = t.use(ctx => {
      ctx.useStatic('use_testFunction', () => mockFn)
    })
    const disposeUse_testFunction = t.use(ctx => {
      ctx.use_testFunction()
    })
    disposeUse_testFunction()
    expect(mockFn).toHaveBeenCalled()
    dispose()
  })
  // TODO clone with field and resolve `this`
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

    const skm1 = t
      .string()
      .use(
        skm => {
          expectTypeOf(skm).toEqualTypeOf<Typp<[StringConstructor]>>()
          return skm as unknown as Typp<[NumberConstructor]>
        },
        skm => {
          expectTypeOf(skm).toEqualTypeOf<Typp<[NumberConstructor]>>()
          return skm as unknown as Typp<[BooleanConstructor]>
        },
        skm => {
          expectTypeOf(skm).toEqualTypeOf<Typp<[BooleanConstructor]>>()
          return skm as unknown as Typp<[NumberConstructor]>
        }
      )
    expectTypeOf(skm1).toEqualTypeOf<Typp<[NumberConstructor]>>()
    // support extends
    t.string().use((skm: Typp<[]>) => {})
    t.string().use((skm: Typp<[StringConstructor]>) => {})
    t
      .string()
      // @ts-expect-error
      .use((skm: Typp<[NumberConstructor]>) => {})
    const skm2 = t
      .string()
      .use(skm => skm as unknown as Typp<[NumberConstructor]>)
      .use(skm => {
        expectTypeOf(skm).toEqualTypeOf<Typp<[NumberConstructor]>>()
        return skm as unknown as Typp<[BooleanConstructor]>
      })
    expectTypeOf(skm2).toEqualTypeOf<Typp<[BooleanConstructor]>>()
  })
  test('return an new instance reference', () => {
    const skm = t.string()
    const skmByUsed = skm.use(skm => {
      skm.meta.test = 1
      skm.meta.arr = [1]
      skm.meta.modifiedRefArr = [{ foo: 1 }]
      return skm
    })
    expect(skm.meta.test).toBeUndefined()
    expect(skm).not.toBe(skmByUsed)
    expect(skmByUsed.meta.test).toBe(1)
    expect(skmByUsed.meta.arr).toEqual([1])
    expect(skmByUsed.meta.modifiedRefArr).toEqual([{ foo: 1 }])

    const clearArrSkm = skmByUsed.use(skm => {
      skm.meta.arr = []
      return skm
    })
    expect(skmByUsed.meta.arr).toEqual([1])
    expect(clearArrSkm.meta.arr).toEqual([])

    const pushArrSkm = clearArrSkm.use(skm => {
      skm.meta.arr.push(2)
      return skm
    })
    expect(clearArrSkm.meta.arr).toEqual([])
    expect(pushArrSkm.meta.arr).toEqual([2])

    const modifiedSkm = skmByUsed.use(skm => {
      skm.meta.modifiedRefArr[0].foo = 2
      return skm
    })
    expect(skmByUsed.meta.modifiedRefArr).toEqual([{ foo: 2 }])
    expect(modifiedSkm.meta.modifiedRefArr).toEqual([{ foo: 2 }])
  })
  test('clone instance only reference when field type is function', () => {
    const skm = t.string()
    const fn = vi.fn()
    const skmByUsed = skm.use(skm => {
      skm.meta.testFn = fn
      skm.meta.testField = { a: 1 }
      return skm
    })
    const skmByUsedClone = skmByUsed.use(skm => skm)
    expect(skmByUsedClone.meta.testFn).toBe(fn)
    expect(skmByUsedClone.meta.testField).toEqual({ a: 1 })
    expect(skmByUsedClone.meta.testField).not.toBe(skmByUsed.meta.testField)
  })
  test('clone instance by clone symbol', () => {
    const skm = t.string()
    let i = 0
    const skmByUsed = skm.use(skm => {
      skm.meta.customCloneObj = t.defineCloneMetaField({
        foo: i++
      }, () => ({
        foo: i++
      }))
      return skm
    })
    expect(skm.meta.customCloneObj).toBeUndefined()
    expect(skmByUsed.meta.customCloneObj).toEqual({ foo: 0 })
    expect(
      skmByUsed
        .use(skm => skm)
        .meta.customCloneObj
    ).toEqual({ foo: 1 })
    expect(skmByUsed.meta.customCloneObj).toEqual({ foo: 0 })
    expect(
      skmByUsed
        .use(skm => skm)
        .use(skm => skm)
        .meta.customCloneObj
    ).toEqual({ foo: 3 })
  })
  test('clone instance with getter', () => {
    const skm = t.string()
    let i = 0
    const skmByUsed = skm.use(skm => {
      Object.defineProperty(skm.meta, 'getter', {
        enumerable: true,
        get() { return i }
      })
      Object.defineProperty(skm.meta, 'dont clone when getter is not enumerable', {
        get() { return i }
      })
      return skm
    })
    expect(skm.meta).not.toHaveProperty('getter')
    expect(skm.meta).not.toHaveProperty('dont clone when getter is not enumerable')
    expect(skmByUsed.meta.getter).toEqual(0)
    expect(skmByUsed.meta['dont clone when getter is not enumerable']).toEqual(0)

    const newSkm = skmByUsed.use(skm => skm)
    expect(newSkm.meta.getter).toEqual(0)
    expect(newSkm.meta).not.toHaveProperty('dont clone when getter is not enumerable')
    i = 1
    expect(newSkm.meta.getter).toEqual(0)
    expect(skmByUsed.meta.getter).toEqual(1)
  })
  test('return the return value of the last function argument', () => {
    const rt = t.string().use(skm => skm, skm => skm, () => 2 as const)
    expectTypeOf(rt).toEqualTypeOf<2>()
    expect(rt).toBe(2)
  })
  test('once modified instance by multiple arguments', () => {
    let skmInChain: Typp<[StringConstructor]>
    const str = t.string()
    const skm = str.use(
      s => {
        expect(s).not.toBe(str)
        skmInChain = s
        s.meta.test = 1
        return s
      },
      s => {
        expect(s, 's is same when use multiple arguments')
          .toBe(skmInChain)
        expect(s.meta.test).toBe(1)
        return s
      }
    )
    expect(str.meta).not.toHaveProperty('test')
    expect(skm.meta.test).toBe(1)
  })
  test('useResolver', () => {
    const dispose = t.useResolver('____test_regResolver', reg => skm => {
      expectTypeOf(reg).toEqualTypeOf<RegExp>()
      expectTypeOf(skm).toEqualTypeOf<Typp<[StringConstructor]>>()
      return skm
    })
    dispose()
    const dispose2 = t.useResolver(
      '____test_regResolver',
      // @ts-expect-error
      reg => skm => {
        return skm as unknown as Typp<[NumberConstructor]>
      }
    )
    dispose2()
  })
  test('utils key', () => {
    const dispose = t.useResolver('____test_regResolver', reg => skm => {
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
    expect(() => {
      t.string().use('____test_regResolver', /.*/)
    }).toThrow('You can\'t use "____test_regResolver" for schema, because it is not in `ResolverUtils`')

    const dispose2 = t.useResolver('____test_dialog', () => skm => skm)
    const skm2 = t.string().use('____test_dialog')
    expectTypeOf(skm2).toEqualTypeOf<Typp<[StringConstructor]>>()
    dispose2()

    const dispose3 = t.useResolver('____test_castToNum', () => skm => skm as Typp<[NumberConstructor]>)
    const skm3 = t.string().use('____test_castToNum')
    expectTypeOf(skm3).toEqualTypeOf<Typp<[NumberConstructor]>>()
    dispose3()
  })
  test('throw error for useResolver', () => {
    expect(() => {
      t.string().use('____test_regResolver', /.*/)
    }).toThrow('You can\'t use "____test_regResolver" for schema, because it is not in `ResolverUtils`')
    const dispose = t.useResolver('____test_regResolver', reg => skm => skm)
    expect(() => {
      t.useResolver('____test_regResolver', reg => skm => skm)
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
  test('throw error when key is not in utils', () => {
    expect(() => {
      t.string().use('____test_not_exist')
    }).toThrow('You can\'t use "____test_not_exist" for schema, because it is not in `ResolverUtils`')
  })
  test('throw error when arguments not match', () => {
    expect(() => {
      // @ts-expect-error
      t.string().use(123)
    }).toThrow('You can\'t use "123" for schema, because it is not a function or string')
  })
})
