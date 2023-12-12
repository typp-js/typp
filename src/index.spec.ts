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

describe('literal', () => {
  test('base', () => {
    const case0 = t(null)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<null, null>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<null>()
    const case1 = t(undefined)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<undefined, undefined>>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<undefined>()
    const case2 = t(true)
    expectTypeOf(case2).toEqualTypeOf<t.Schema<BooleanConstructor, true>>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<true>()
    const case3 = t(false)
    expectTypeOf(case3).toEqualTypeOf<t.Schema<BooleanConstructor, false>>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<false>()
    const case4 = t('')
    expectTypeOf(case4).toEqualTypeOf<t.Schema<StringConstructor, ''>>()
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<''>()
    const case5 = t(0)
    expectTypeOf(case5).toEqualTypeOf<t.Schema<NumberConstructor, 0>>()
    expectTypeOf<t.Infer<typeof case5>>()
      .toEqualTypeOf<0>()
    const case6 = t(1)
    expectTypeOf(case6).toEqualTypeOf<t.Schema<NumberConstructor, 1>>()
    expectTypeOf<t.Infer<typeof case6>>()
      .toEqualTypeOf<1>()
    const case7 = t(Symbol())
    expectTypeOf(case7).toEqualTypeOf<t.Schema<SymbolConstructor, symbol>>()
    expectTypeOf<t.Infer<typeof case7>>()
      .toEqualTypeOf<symbol>()
    const case8 = t(BigInt(0))
    expectTypeOf(case8).toEqualTypeOf<t.Schema<BigIntConstructor, bigint>>()
    expectTypeOf<t.Infer<typeof case8>>()
      .toEqualTypeOf<bigint>()
  })
})

describe('union', () => {
  test('base', () => {
    const case0 = t.union([])
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      typeof t.Symbols.never, never
    >>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<never>()
    const case1 = t.union([Number])
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.Schema<NumberConstructor, number>,
      number
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<number>()
    const case2 = t.union([Number, String])
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.Schema<NumberConstructor, number> | t.Schema<StringConstructor, string>,
      number | string
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<number | string>()
  })
})

describe('intersect', () => {})
