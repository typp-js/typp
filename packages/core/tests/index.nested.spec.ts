import { describe, expect, expectTypeOf, test } from 'vitest'

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
    const [item0_0] = case0_0.shape
    const [item0_1] = case0_1.shape
    expect(item0_0.shape.type).toBe(t.Symbols.any)
    expect(item0_1.shape.type).toBe(t.Symbols.any)
    expectTypeOf(item0_0).toEqualTypeOf<t.Schema<any, any>>()
    expectTypeOf(item0_1).toEqualTypeOf<t.Schema<any, any>>()
    expectTypeOf<t.Infer<typeof item0_0>>()
      .toEqualTypeOf<any>()
    expectTypeOf<t.Infer<typeof item0_1>>()
      .toEqualTypeOf<any>()

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
    const [item1_0] = case1_0.shape
    const [item1_1] = case1_1.shape
    const [item1_2] = case1_2.shape
    expect(item1_0.shape).toBe(Number)
    expect(item1_1.shape).toBe(Number)
    expect(item1_2.shape).toBe(Number)
    expectTypeOf(item1_0).toEqualTypeOf<t.Schema<NumberConstructor, number>>()
    expectTypeOf(item1_1).toEqualTypeOf<t.Schema<NumberConstructor, number>>()
    expectTypeOf(item1_2).toEqualTypeOf<t.Schema<NumberConstructor, number>>()

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
    const [item2_0] = case2_0.shape[0].shape
    const [item2_1] = case2_1.shape[0].shape
    const [item2_2] = case2_2.shape[0].shape
    expect(item2_0.shape).toBe(Number)
    expect(item2_1.shape).toBe(Number)
    expect(item2_2.shape).toBe(Number)
    expectTypeOf(item2_0).toEqualTypeOf<t.Schema<NumberConstructor, number>>()
    expectTypeOf(item2_1).toEqualTypeOf<t.Schema<NumberConstructor, number>>()
    expectTypeOf(item2_2).toEqualTypeOf<t.Schema<NumberConstructor, number>>()

    const case3_0 = t(Array, { a: Number })
    const case3_1 = t.array({ a: Number })
    const case3_2 = t.array(t({ a: Number }))
    expectTypeOf(case3_0).toEqualTypeOf<t.Schema<
      t.Schema<{
        a: t.Schema<NumberConstructor, number>
      }, {
        a: number
      }>[],
      {
        a: number
      }[]
    >>()
    expectTypeOf<t.Infer<typeof case3_0>>()
      .toEqualTypeOf<{ a: number }[]>()
    expectTypeOf(case3_0).toEqualTypeOf<typeof case3_1>()
    expectTypeOf(case3_0).toEqualTypeOf<typeof case3_2>()
  })
  test('define array by `[]`', () => {
    const emptyTuple = t([])
    expectTypeOf(emptyTuple).toEqualTypeOf<t.Schema<[], []>>()
    expectTypeOf<t.Infer<typeof emptyTuple>>()
      .toEqualTypeOf<[]>()
    expect(emptyTuple.shape).toEqual([])
    expectTypeOf(emptyTuple.shape).toEqualTypeOf<[]>()

    const numberArray = t([], Number)
    expectTypeOf(numberArray).toEqualTypeOf<t.Schema<
      t.Schema<NumberConstructor, number>[],
      number[]
    >>()
    expectTypeOf<t.Infer<typeof numberArray>>()
      .toEqualTypeOf<number[]>()
    const [item] = numberArray.shape
    expect(item.shape).toBe(Number)
    expectTypeOf(item).toEqualTypeOf<t.Schema<NumberConstructor, number>>()
    expectTypeOf<t.Infer<typeof item>>()
      .toEqualTypeOf<number>()
    const numberMatrix = t([], [], Number)
    expectTypeOf(numberMatrix).toEqualTypeOf<t.Schema<
      t.Schema<t.Schema<NumberConstructor, number>[], number[]>[],
      number[][]
    >>()
    expectTypeOf<t.Infer<typeof numberMatrix>>()
      .toEqualTypeOf<number[][]>()
    const [row] = numberMatrix.shape
    const [item2] = row.shape
    expect(item2.shape).toBe(Number)
    expectTypeOf(item2).toEqualTypeOf<t.Schema<NumberConstructor, number>>()
    expectTypeOf<t.Infer<typeof item2>>()
      .toEqualTypeOf<number>()
  })
  test('tuple', () => {
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
          a: t.Schema<StringConstructor, string>
        }, {
          a: string
        }>
      ],
      [number, {
        a: string
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
        a: t.Schema<NumberConstructor, number>
      }, {
        a: number
      }>>,
      Set<{
        a: number
      }>
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<Set<{ a: number }>>()
  })
})

describe('object', () => {
  test('object', () => {
    const case0 = t(Object)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
        [
          t.Schema<StringConstructor, string>,
          t.Schema<NumberConstructor, number>,
          t.Schema<SymbolConstructor, symbol>,
        ],
        t.Schema<any, any>
      ]>, {
        [k: string | number | symbol]: any
      }>
    >()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<{ [x: string | number | symbol]: any }>()

    const case1 = t(Object, Number)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<{
      [x: number]: t.Schema<any, any>
    }, {
      [x: number]: any
    }>>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<{ [x: number]: any }>()

    const case2 = t(Object, Number, String)
    expectTypeOf(case2)
      .toEqualTypeOf<
        t.Schema<{
          [x: number]: t.Schema<StringConstructor, string>
        }, {
          [x: number]: string
        }>
      >()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<{ [x: number]: string }>()
    const case3 = t(Object, Number, Object)
    expectTypeOf(case3)
      .toEqualTypeOf<
        t.Schema<{
          [x: number]: t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
            [
              t.Schema<StringConstructor, string>,
              t.Schema<NumberConstructor, number>,
              t.Schema<SymbolConstructor, symbol>,
            ],
            t.Schema<any, any>
          ]>, {
            [x: string | number | symbol]: any
          }>
        }, {
          [x: number]: {
            [x: string | number | symbol]: any
          }
        }>
      >()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<{ [x: number]: { [x: string | number | symbol]: any } }>()
    const case4 = t(Object, Object)
    expectTypeOf<typeof case4>().toEqualTypeOf<never>()
  })
  test('interface', () => {
    const case0 = t({})
    expectTypeOf(case0).toEqualTypeOf<t.Schema<{}, {}>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<{}>()
    const case1 = t({ a: Number, b: String })
    expectTypeOf(case1).toEqualTypeOf<t.Schema<{
      a: t.Schema<NumberConstructor, number>
      b: t.Schema<StringConstructor, string>
    }, {
      a: number
      b: string
    }>>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<{ a: number; b: string }>()
    const case2 = t({ a: Number, b: { c: String } })
    expectTypeOf(case2).toEqualTypeOf<t.Schema<{
      a: t.Schema<NumberConstructor, number>
      b: t.Schema<{
        c: t.Schema<StringConstructor, string>
      }, {
        c: string
      }>
    }, {
      a: number
      b: {
        c: string
      }
    }>>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<{ a: number; b: { c: string } }>()
    const case3 = t({ a: t([], Number) })
    expectTypeOf(case3).toEqualTypeOf<t.Schema<{
      a: t.Schema<t.Schema<NumberConstructor, number>[], number[]>
    }, {
      a: number[]
    }>>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<{ a: number[] }>()
    const case4 = t({ a: Number, b: Object })
    expectTypeOf(case4).toEqualTypeOf<t.Schema<{
      a: t.Schema<NumberConstructor, number>
      b: t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
        [
          t.Schema<StringConstructor, string>,
          t.Schema<NumberConstructor, number>,
          t.Schema<SymbolConstructor, symbol>,
        ],
        t.Schema<any, any>
      ]>, {
        [x: string | number | symbol]: any
      }>
    }, {
      a: number
      b: {
        [x: string | number | symbol]: any
      }
    }>>()
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<{ a: number; b: { [x: string | number | symbol]: any } }>()
    // t({}, String, Number)
    // t.record(String, Number)
    // t.object(String, Number)
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
