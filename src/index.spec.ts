import { test, expectTypeOf, describe } from 'vitest'

import { t } from './index'

test('primitive', () => {
  const cases = [
    [t(String), String, {} as string],
    [t(Number), Number, {} as number],
    [t(Boolean), Boolean, {} as boolean],
    [t(Symbol), Symbol, {} as symbol],
    [t(BigInt), BigInt, {} as bigint],
  ] as const

  expectTypeOf(cases[0][0])
    .toEqualTypeOf<t.Schema<typeof cases[0][1], typeof cases[0][2]>>()
  expectTypeOf<t.Infer<typeof cases[0][0]>>()
    .toEqualTypeOf<typeof cases[0][2]>()
  expectTypeOf(cases[1][0])
    .toEqualTypeOf<t.Schema<typeof cases[1][1], typeof cases[1][2]>>()
  expectTypeOf<t.Infer<typeof cases[1][0]>>()
    .toEqualTypeOf<typeof cases[1][2]>()
  expectTypeOf(cases[2][0])
    .toEqualTypeOf<t.Schema<typeof cases[2][1], typeof cases[2][2]>>()
  expectTypeOf<t.Infer<typeof cases[2][0]>>()
    .toEqualTypeOf<typeof cases[2][2]>()
  expectTypeOf(cases[3][0])
    .toEqualTypeOf<t.Schema<typeof cases[3][1], typeof cases[3][2]>>()
  expectTypeOf<t.Infer<typeof cases[3][0]>>()
    .toEqualTypeOf<typeof cases[3][2]>()
  expectTypeOf(cases[4][0])
    .toEqualTypeOf<t.Schema<typeof cases[4][1], typeof cases[4][2]>>()
  expectTypeOf<t.Infer<typeof cases[4][0]>>()
    .toEqualTypeOf<typeof cases[4][2]>()
})

describe('array and tuple', () => {
  test('array', () => {
    const case0 = t(Array)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      t.Schema<any, any>[], any[]
    >>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<any[]>()
    const case1 = t(Array, Number)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.Schema<NumberConstructor, number>[],
      number[]
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<number[]>()
    const case2 = t(Array, Array, Number)
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.Schema<t.Schema<NumberConstructor, number>[], number[]>[],
      number[][]
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<number[][]>()
  })
  test('tuple', () => {
    expectTypeOf(t([])).toEqualTypeOf<t.Schema<[], []>>()
    expectTypeOf(t([], Number)).toEqualTypeOf<t.Schema<
      t.Schema<NumberConstructor, number>[],
      number[]
    >>()
    expectTypeOf(t([], [], Number)).toEqualTypeOf<t.Schema<
      t.Schema<t.Schema<NumberConstructor, number>[], number[]>[],
      number[][]
    >>()
  })
})

describe('object', () => {
  test('object', () => {
    const case0 = t(Object)
    expectTypeOf(t(Object)).toEqualTypeOf<t.Schema<{
      [x: string | number | symbol]: t.Schema<any, any>
    }, {
      [x: string | number | symbol]: any
    }>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<{ [x: string | number | symbol]: any }>()
    const case1 = t(Object, Number, String)
    expectTypeOf(case1)
      .toEqualTypeOf<
        t.Schema<{
          [x: number]: t.Schema<StringConstructor, string>;
        }, {
          [x: number]: string;
        }>
      >()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<{ [x: number]: string }>()
    const case2 = t(Object, Number, Object)
    expectTypeOf(case2)
      .toEqualTypeOf<
        t.Schema<{
          [x: number]: t.Schema<{
            [x: string | number | symbol]: t.Schema<any, any>;
          }, {
            [x: string | number | symbol]: any;
          }>;
        }, {
          [x: number]: {
            [x: string | number | symbol]: any;
          };
        }>
      >()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<{ [x: number]: { [x: string | number | symbol]: any } }>()
    const case3 = t(Object, Object)
    expectTypeOf<typeof case3>().toEqualTypeOf<never>()
  })
})
