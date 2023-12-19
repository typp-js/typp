import { test, expectTypeOf, describe } from 'vitest'

import { t } from '../src'

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
  test('Set', () => {
    const case0 = t(Set)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      t.Set<t.Schema<any, any>>,
      Set<any>
    >>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<Set<any>>()
    const case1 = t(Set, Number)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.Set<t.Schema<NumberConstructor, number>>,
      Set<number>
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<Set<number>>()
    const case2 = t(Set, { a: Number })
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.Set<t.Schema<{
        a: t.Schema<NumberConstructor, number>;
      }, {
        a: number;
      }>>,
      Set<{
        a: number;
      }>
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<Set<{ a: number }>>()
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
  test('interface', () => {
    const case0 = t({})
    expectTypeOf(case0).toEqualTypeOf<t.Schema<{}, {}>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<{}>()
    const case1 = t({ a: Number, b: String })
    expectTypeOf(case1).toEqualTypeOf<t.Schema<{
      a: t.Schema<NumberConstructor, number>;
      b: t.Schema<StringConstructor, string>;
    }, {
      a: number;
      b: string;
    }>>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<{ a: number; b: string }>()
    const case2 = t({ a: Number, b: { c: String } })
    expectTypeOf(case2).toEqualTypeOf<t.Schema<{
      a: t.Schema<NumberConstructor, number>;
      b: t.Schema<{
        c: t.Schema<StringConstructor, string>;
      }, {
        c: string;
      }>;
    }, {
      a: number;
      b: {
        c: string;
      };
    }>>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<{ a: number; b: { c: string } }>()
    const case3 = t({ a: t([], Number) })
    expectTypeOf(case3).toEqualTypeOf<t.Schema<{
      a: t.Schema<t.Schema<NumberConstructor, number>[], number[]>;
    }, {
      a: number[];
    }>>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<{ a: number[] }>()
    const case4 = t({ a: Number, b: Object })
    expectTypeOf(case4).toEqualTypeOf<t.Schema<{
      a: t.Schema<NumberConstructor, number>;
      b: t.Schema<{
        [x: string | number | symbol]: t.Schema<any, any>;
      }, {
        [x: string | number | symbol]: any;
      }>;
    }, {
      a: number;
      b: {
        [x: string | number | symbol]: any;
      };
    }>>()
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<{ a: number; b: { [x: string | number | symbol]: any } }>()
  })
  test('Map', () => {
    const case0 = t(Map)
    expectTypeOf(case0).toEqualTypeOf<
      t.Schema<
        t.Map<t.Schema<any, any>, t.Schema<any, any>>,
        Map<any, any>
      >
    >()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<Map<any, any>>()

    const case1 = t(Map, Number)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.Map<t.Schema<NumberConstructor, number>, t.Schema<any, any>>,
      Map<number, any>
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<Map<number, any>>()

    const case2 = t(Map, Number, String)
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.Map<
        t.Schema<NumberConstructor, number>,
        t.Schema<StringConstructor, string>
      >,
      Map<number, string>
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<Map<number, string>>()
  })
})
