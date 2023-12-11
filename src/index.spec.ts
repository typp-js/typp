import { test, expectTypeOf, describe } from 'vitest'

import { t } from './index'

test('primitive', () => {
  expectTypeOf(t(String)).toEqualTypeOf<t.Schema<StringConstructor, string>>()
  expectTypeOf(t()).toEqualTypeOf<t.Schema<any, any>>()
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
    expectTypeOf(t(Object, Number, String))
      .toEqualTypeOf<
        t.Schema<{
          [x: number]: t.Schema<StringConstructor, string>;
        }, {
          [x: number]: string;
        }>
      >()
  })
})
