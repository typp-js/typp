import { describe, expect, expectTypeOf, test } from 'vitest'

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
