import { describe, expectTypeOf, test } from 'vitest'

import { t } from '../src'

describe('array and tuple', () => {
  test('array', () => {
    const case0_0 = t(Array)
    const case0_1 = t.array()
    expectTypeOf(case0_0).toEqualTypeOf<t.Schema<
      t.Schema<any, any>[], any[]
    >>()
    expectTypeOf<t.Infer<typeof case0_0>>()
      .toEqualTypeOf<any[]>()
    expectTypeOf(case0_0).toEqualTypeOf<typeof case0_1>()

    const case1_0 = t(Array, Number)
    const case1_1 = t.array(Number)
    const case1_2 = t.array(t(Number))
    expectTypeOf(case1_0).toEqualTypeOf<t.Schema<
      t.Schema<NumberConstructor, number>[],
      number[]
    >>()
    expectTypeOf<t.Infer<typeof case1_0>>()
      .toEqualTypeOf<number[]>()
    expectTypeOf(case1_0).toEqualTypeOf<typeof case1_1>()
    expectTypeOf(case1_0).toEqualTypeOf<typeof case1_2>()

    const case2_0 = t(Array, Array, Number)
    const case2_1 = t.array(Array, Number)
    const case2_2 = t.array(t.array(Number))
    expectTypeOf(case2_0).toEqualTypeOf<t.Schema<
      t.Schema<t.Schema<NumberConstructor, number>[], number[]>[],
      number[][]
    >>()
    expectTypeOf<t.Infer<typeof case2_0>>()
      .toEqualTypeOf<number[][]>()
    expectTypeOf(case2_0).toEqualTypeOf<typeof case2_1>()
    expectTypeOf(case2_0).toEqualTypeOf<typeof case2_2>()

    const case3_0 = t(Array, { a: Number })
    const case3_1 = t.array({ a: Number })
    const case3_2 = t.array(t({ a: Number }))
    expectTypeOf(case3_0).toEqualTypeOf<t.Schema<
      t.Schema<{
        a: t.Schema<NumberConstructor, number>;
      }, {
        a: number;
      }>[],
      {
        a: number;
      }[]
    >>()
    expectTypeOf<t.Infer<typeof case3_0>>()
      .toEqualTypeOf<{ a: number }[]>()
    expectTypeOf(case3_0).toEqualTypeOf<typeof case3_1>()
    expectTypeOf(case3_0).toEqualTypeOf<typeof case3_2>()
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
    const case0_0 = t([Number])
    const case0_1 = t.tuple(Number)
    expectTypeOf(case0_0).toEqualTypeOf<t.Schema<
      [t.Schema<NumberConstructor, number>],
      [number]
    >>()
    expectTypeOf<t.Infer<typeof case0_0>>()
      .toEqualTypeOf<[number]>()
    expectTypeOf(case0_0).toEqualTypeOf<typeof case0_1>()
    const case1_0 = t([Number, String])
    const case1_1 = t.tuple(Number, String)
    expectTypeOf(case1_0).toEqualTypeOf<t.Schema<
      [
        t.Schema<NumberConstructor, number>,
        t.Schema<StringConstructor, string>
      ],
      [number, string]
    >>()
    expectTypeOf<t.Infer<typeof case1_0>>()
      .toEqualTypeOf<[number, string]>()
    expectTypeOf(case1_0).toEqualTypeOf<typeof case1_1>()
    const case2_0 = t([Number, [String]])
    const case2_1 = t.tuple(Number, [String])
    expectTypeOf(case2_0).toEqualTypeOf<t.Schema<
      [
        t.Schema<NumberConstructor, number>,
        t.Schema<[t.Schema<StringConstructor, string>], [string]>
      ],
      [number, [string]]
    >>()
    expectTypeOf<t.Infer<typeof case2_0>>()
      .toEqualTypeOf<[number, [string]]>()
    expectTypeOf(case2_0).toEqualTypeOf<typeof case2_1>()
    const case3_0 = t([Number, { a: String }])
    const case3_1 = t.tuple(Number, { a: String })
    expectTypeOf(case3_0).toEqualTypeOf<t.Schema<
      [
        t.Schema<NumberConstructor, number>,
        t.Schema<{
          a: t.Schema<StringConstructor, string>;
        }, {
          a: string;
        }>
      ],
      [number, {
        a: string;
      }]
    >>()
    expectTypeOf<t.Infer<typeof case3_0>>()
      .toEqualTypeOf<[number, { a: string }]>()
    expectTypeOf(case3_0).toEqualTypeOf<typeof case3_1>()
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
