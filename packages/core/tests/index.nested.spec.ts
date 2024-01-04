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
    const shape0_0 = case0_0.shape
    const shape0_1 = case0_1.shape
    expect(shape0_0).toEqual([t(Number)])
    expect(shape0_1).toEqual(shape0_0)
    expectTypeOf(shape0_0).toEqualTypeOf<[t.Schema<NumberConstructor, number>]>()

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
    const shape1_0 = case1_0.shape
    const shape1_1 = case1_1.shape
    expect(shape1_0).toEqual([t(Number), t(String)])
    expect(shape1_1).toEqual(shape1_0)
    expectTypeOf(shape1_0).toEqualTypeOf<
      [t.Schema<NumberConstructor, number>, t.Schema<StringConstructor, string>]
    >()

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
    const shape2_0 = case2_0.shape
    const shape2_1 = case2_1.shape
    expect(shape2_0).toEqual([t(Number), t([t(String)])])
    expect(shape2_1).toEqual(shape2_0)
    expectTypeOf(shape2_0).toEqualTypeOf<
      [
        t.Schema<NumberConstructor, number>,
        t.Schema<[t.Schema<StringConstructor, string>], [string]>
      ]
    >()

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
    const shape3_0 = case3_0.shape
    const shape3_1 = case3_1.shape
    expect(shape3_0).toEqual([t(Number), t({ a: t(String) })])
    expect(shape3_1).toEqual(shape3_0)
    expectTypeOf(shape3_0).toEqualTypeOf<
      [
        t.Schema<NumberConstructor, number>,
        t.Schema<{
          a: t.Schema<StringConstructor, string>
        }, {
          a: string
        }>
      ]
    >()
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
    const shape0 = case0.shape
    expect(shape0.type).toBe(t.specialShapeTypeMapping.record)
    expect(shape0.schemas).toEqual([
      [t(String), t(Number), t(Symbol)], t()
    ])
    expectTypeOf(shape0).toEqualTypeOf<t.SpecialShape<
      t.SpecialShapeTypeMapping['record'], [
        [
          t.Schema<StringConstructor, string>,
          t.Schema<NumberConstructor, number>,
          t.Schema<SymbolConstructor, symbol>,
        ],
        t.Schema<any, any>
      ]
    >>()

    const case1 = t(Object, Number)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
        [t.Schema<NumberConstructor, number>],
        t.Schema<any, any>
      ]>, {
        [x: number]: any
      }>
    >()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<{ [x: number]: any }>()
    const shape1 = case1.shape
    expect(shape1.type).toBe(t.specialShapeTypeMapping.record)
    expect(shape1.schemas).toEqual([
      [t(Number)], t()
    ])
    expectTypeOf(shape1).toEqualTypeOf<t.SpecialShape<
      t.SpecialShapeTypeMapping['record'], [
        [t.Schema<NumberConstructor, number>],
        t.Schema<any, any>
      ]
    >>()

    const case2 = t(Object, Number, String)
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
        [t.Schema<NumberConstructor, number>],
        t.Schema<StringConstructor, string>
      ]>, {
        [x: number]: string
      }>
    >()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<{ [x: number]: string }>()
    const shape2 = case2.shape
    expect(shape2.type).toBe(t.specialShapeTypeMapping.record)
    expect(shape2.schemas).toEqual([
      [t(Number)], t(String)
    ])
    expectTypeOf(shape2).toEqualTypeOf<t.SpecialShape<
      t.SpecialShapeTypeMapping['record'], [
        [t.Schema<NumberConstructor, number>],
        t.Schema<StringConstructor, string>
      ]
    >>()

    const case3 = t(Object, Number, Object)
    expectTypeOf(case3).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
        [t.Schema<NumberConstructor, number>],
        t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
          [
            t.Schema<StringConstructor, string>,
            t.Schema<NumberConstructor, number>,
            t.Schema<SymbolConstructor, symbol>,
          ],
          t.Schema<any, any>
        ]>, {
          [x: string | number | symbol]: any
        }>
      ]>, {
        [x: number]: {
          [x: string | number | symbol]: any
        }
      }>
    >()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<{ [x: number]: { [x: string | number | symbol]: any } }>()
    const shape3 = case3.shape
    expect(shape3.type).toBe(t.specialShapeTypeMapping.record)
    expect(shape3.schemas).toEqual([[t(Number)], t(Object)])
    expectTypeOf(shape3).toEqualTypeOf<t.SpecialShape<
      t.SpecialShapeTypeMapping['record'], [
        [t.Schema<NumberConstructor, number>],
        t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
          [
            t.Schema<StringConstructor, string>,
            t.Schema<NumberConstructor, number>,
            t.Schema<SymbolConstructor, symbol>,
          ],
          t.Schema<any, any>
        ]>, {
          [x: string | number | symbol]: any
        }>
      ]
    >>()

    const case4 = t(Object, Object)
    expectTypeOf<typeof case4>().toEqualTypeOf<never>()
  })
  test('interface', () => {
    const case0 = t({})
    expectTypeOf(case0).toEqualTypeOf<t.Schema<{}, {}>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<{}>()
    const shape0 = case0.shape
    expect(shape0).toEqual({})
    expectTypeOf(shape0).toEqualTypeOf<{}>()

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
    const shape1 = case1.shape
    expect(shape1).toEqual({
      a: t(Number),
      b: t(String),
    })
    expectTypeOf(shape1).toEqualTypeOf<{
      a: t.Schema<NumberConstructor, number>
      b: t.Schema<StringConstructor, string>
    }>()

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
    const shape2 = case2.shape
    expect(shape2).toEqual({
      a: t(Number),
      b: t({ c: t(String) }),
    })
    expectTypeOf(shape2).toEqualTypeOf<{
      a: t.Schema<NumberConstructor, number>
      b: t.Schema<{
        c: t.Schema<StringConstructor, string>
      }, {
        c: string
      }>
    }>()

    const case3 = t({ a: t([], Number) })
    expectTypeOf(case3).toEqualTypeOf<t.Schema<{
      a: t.Schema<t.Schema<NumberConstructor, number>[], number[]>
    }, {
      a: number[]
    }>>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<{ a: number[] }>()
    const shape3 = case3.shape
    expect(shape3).toEqual({
      a: t([], Number),
    })
    expectTypeOf(shape3).toEqualTypeOf<{
      a: t.Schema<t.Schema<NumberConstructor, number>[], number[]>
    }>()

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
    const shape4 = case4.shape
    expect(shape4).toEqual({
      a: t(Number),
      b: t(Object),
    })
    expectTypeOf(shape4).toEqualTypeOf<{
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
    }>()

    // t.record(String, Number)
    // t.object(String, Number)
  })
  test('define record by `{}`', () => {
    const case0 = t({}, Number)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
        [t.Schema<NumberConstructor, number>],
        t.Schema<any, any>
      ]>, {
        [x: number]: any
      }
    >>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<{ [x: number]: any }>()
    const shape0 = case0.shape
    expect(shape0.type).toBe(t.specialShapeTypeMapping.record)
    expect(shape0.schemas).toEqual([[t(Number)], t()])
    expectTypeOf(shape0).toEqualTypeOf<t.SpecialShape<
      t.SpecialShapeTypeMapping['record'], [
        [t.Schema<NumberConstructor, number>],
        t.Schema<any, any>
      ]
    >>()
    const case1 = t({}, String, Number)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['record'], [
        [
          t.Schema<StringConstructor, string>
        ],
        t.Schema<NumberConstructor, number>
      ]>, {
      [x: string]: number
    }
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<{ [x: string]: number }>()
    const shape1 = case1.shape
    expect(shape1.type).toBe(t.specialShapeTypeMapping.record)
    expect(shape1.schemas).toEqual([[t(String)], t(Number)])
    expectTypeOf(shape1).toEqualTypeOf<t.SpecialShape<
      t.SpecialShapeTypeMapping['record'], [
        [t.Schema<StringConstructor, string>],
        t.Schema<NumberConstructor, number>
      ]
    >>()
  })
  test('Map', () => {
    const case0 = t(Map)
    expectTypeOf(case0).toEqualTypeOf<
      t.Schema<
        t.MapShape<t.Schema<any, any>, t.Schema<any, any>>,
        Map<any, any>
      >
    >()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<Map<any, any>>()

    const case1 = t(Map, Number)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.MapShape<t.Schema<NumberConstructor, number>, t.Schema<any, any>>,
      Map<number, any>
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<Map<number, any>>()

    const case2 = t(Map, Number, String)
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.MapShape<
        t.Schema<NumberConstructor, number>,
        t.Schema<StringConstructor, string>
      >,
      Map<number, string>
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<Map<number, string>>()
  })
})
