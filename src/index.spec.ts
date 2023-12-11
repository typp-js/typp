import { test, expectTypeOf, describe } from 'vitest'

import { t } from './index'

test('primitive', () => {
  expectTypeOf(t(String)).toEqualTypeOf<t.Schema<StringConstructor, string>>()
  expectTypeOf(t()).toEqualTypeOf<t.Schema<any, any>>()
})

describe('array and tuple', () => {
  test('array', () => {
    expectTypeOf(t(Array)).toEqualTypeOf<t.Schema<
      t.Schema<any, any>[], any[]
    >>()
    expectTypeOf(t(Array, Number))
      .toEqualTypeOf<
        t.Schema<
          t.Schema<NumberConstructor, number>[],
          number[]
        >
      >()
    expectTypeOf(t(Array, Array, Number))
      .toEqualTypeOf<
        t.Schema<
          t.Schema<t.Schema<NumberConstructor, number>[], number[]>[],
          number[][]
        >
      >()
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
