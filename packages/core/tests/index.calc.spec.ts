import { t } from '@typp/core'
import { describe, expect, expectTypeOf, test } from 'vitest'

describe('union', () => {
  test('base', () => {
    const case0 = t.union([])
    const shape0 = case0.shape
    expect(shape0.type).toBe(t.specialShapeTypeMapping.never)
    expect(shape0.schemas).toEqual(undefined)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['never']>,
      never
    >>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<never>()

    const case1_0 = t.union([Number])
    const case1_1 = t.union([t(Number)])
    expect(case1_0.shape).toBe(Number)
    expect(case1_1.shape).toBe(case1_0.shape)
    expectTypeOf(case1_0).toEqualTypeOf<t.Schema<NumberConstructor, number>>()
    expectTypeOf<t.Infer<typeof case1_0>>()
      .toEqualTypeOf<number>()
    expectTypeOf(case1_1).toEqualTypeOf<typeof case1_0>()
    expectTypeOf<t.Infer<typeof case1_1>>()
      .toEqualTypeOf<number>()

    const case2 = t.union([Number, String])
    const shape2 = case2.shape
    expect(shape2.type).toBe(t.specialShapeTypeMapping.union)
    expect(shape2.schemas).toEqual([t(Number), t(String)])
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['union'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<StringConstructor, string>
        ]
      >,
      number | string
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<number | string>()

    const case3 = t.union([1, 2, '3', true, null, undefined])
    const shape3 = case3.shape
    expect(shape3.type).toBe(t.specialShapeTypeMapping.union)
    expect(shape3.schemas).toEqual([
      t(1), t(2), t('3'), t(true), t(null), t(undefined)
    ])
    expectTypeOf(case3).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['union'], [
        t.Schema<1, 1>,
        t.Schema<2, 2>,
        t.Schema<'3', '3'>,
        t.Schema<true, true>,
        t.Schema<null, null>,
        t.Schema<undefined, undefined>,
      ]>,
      1 | 2 | '3' | true | null | undefined
    >>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<1 | 2 | '3' | true | null | undefined>()
  })
  test('instance.or', () => {
    const case0_0 = t(Number).or(String)
    const case0_1 = t(Number).or(t(String))
    expect(case0_0).toStrictEqual(t.union([Number, String]))
    expect(case0_1).toStrictEqual(case0_0)
    expectTypeOf(case0_0).toEqualTypeOf<typeof case0_1>()
    expectTypeOf(case0_0).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['union'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<StringConstructor, string>
        ]
      >,
      number | string
    >>()
    expectTypeOf<t.Infer<typeof case0_0>>()
      .toEqualTypeOf<number | string>()

    const case1 = t(Number).or(String).or(Boolean)
    expect(case1).toStrictEqual(t.union([Number, String, Boolean]))
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['union'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<StringConstructor, string>,
          t.Schema<BooleanConstructor, boolean>
        ]
      >,
      number | string | boolean
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<number | string | boolean>()

    const case2 = t.union([1, 2, '3']).or(Boolean)
    expect(case2).toStrictEqual(t.union([1, 2, '3', Boolean]))
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['union'], [
          t.Schema<1, 1>,
          t.Schema<2, 2>,
          t.Schema<'3', '3'>,
          t.Schema<BooleanConstructor, boolean>
        ]
      >,
      1 | 2 | '3' | boolean
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<1 | 2 | '3' | boolean>()

    const case3 = t.union([1, 2, '3']).or(t.union([true, false]))
    expect(case3).toStrictEqual(t.union([
      1, 2, '3',
      t.union([true, false])
    ]))
    expectTypeOf(case3).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['union'], [
          t.Schema<1, 1>,
          t.Schema<2, 2>,
          t.Schema<'3', '3'>,
          t.Schema<
            t.SpecialShape<t.SpecialShapeTypeMapping['union'], [
              t.Schema<true, true>,
              t.Schema<false, false>
            ]>,
            true | false
          >
        ]
      >,
      1 | 2 | '3' | true | false
    >>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<1 | 2 | '3' | true | false>()
  })
})

describe('intersect', () => {
  test('base', () => {
    const case0 = t.intersect([1])
    const shape0 = case0.shape
    expect(shape0).toBe(1)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<1, 1>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<1>()

    const case1 = t.intersect([1, Number])
    const shape1 = case1.shape
    expect(shape1.type).toBe(t.specialShapeTypeMapping.intersection)
    expect(shape1.schemas).toEqual([t(1), t(Number)])
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<1, 1>,
          t.Schema<NumberConstructor, number>
        ]
      >,
      1
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<1>()

    const case2 = t.intersect([1, Number, String])
    const shape2 = case2.shape
    expect(shape2.type).toBe(t.specialShapeTypeMapping.intersection)
    expect(shape2.schemas).toEqual([t(1), t(Number), t(String)])
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<1, 1>,
          t.Schema<NumberConstructor, number>,
          t.Schema<StringConstructor, string>
        ]
      >,
      never
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<never>()

    const case3 = t.intersect([Number, t.unknown()])
    const shape3 = case3.shape
    expect(shape3.type).toBe(t.specialShapeTypeMapping.intersection)
    expect(shape3.schemas).toEqual([t(Number), t.unknown()])
    expectTypeOf(case3).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['intersection'], [
        t.Schema<NumberConstructor, number>,
        t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['unknown']>, unknown>
      ]>,
      number
    >>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<number>()

    const case4 = t.intersect([Number, t.never()])
    const shape4 = case4.shape
    expect(shape4.type).toBe(t.specialShapeTypeMapping.intersection)
    expect(shape4.schemas).toEqual([t(Number), t.never()])
    expectTypeOf(case4).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['never']>, never>
        ]
      >,
      never
    >>()
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<never>()

    const case5 = t.intersect([Number, t.any()])
    const shape5 = case5.shape
    expect(shape5.type).toBe(t.specialShapeTypeMapping.intersection)
    expect(shape5.schemas).toEqual([t(Number), t.any()])
    expectTypeOf(case5).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<any, any>
        ]
      >,
      any
    >>()
    expectTypeOf<t.Infer<typeof case5>>()
      .toEqualTypeOf<any>()

    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#improved-intersection-reduction-union-compatibility-and-narrowing:~:text=Another%20change%20is%20that%20%7B%7D%20intersected%20with%20any%20other%20object%20type%20simplifies%20right%20down%20to%20that%20object%20type.%20That%20meant%20that%20we%20were%20able%20to%20rewrite%20NonNullable%20to%20just%20use%20an%20intersection%20with%20%7B%7D%2C%20because%20%7B%7D%20%26%20null%20and%20%7B%7D%20%26%20undefined%20just%20get%20tossed%20away.
    // Another change is that {} intersected with any other object type simplifies right down to that object type.
    // That meant that we were able to rewrite NonNullable to just use an intersection with {},
    // because {} & null and {} & undefined just get tossed away.
    const case6 = t.intersect([Number, {}])
    const shape6 = case6.shape
    expect(shape6.type).toBe(t.specialShapeTypeMapping.intersection)
    expect(shape6.schemas).toEqual([t(Number), t({})])
    expectTypeOf(case6).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<{}, {}>
        ]
      >,
      number
    >>()
    expectTypeOf<t.Infer<typeof case6>>()
      .toEqualTypeOf<number>()

    const case7 = t.intersect([Number, t({})])
    const shape7 = case7.shape
    expect(shape7.type).toBe(t.specialShapeTypeMapping.intersection)
    expect(shape7.schemas).toEqual([t(Number), t({})])
    expectTypeOf(case7).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<{}, {}>
        ]
      >,
      number
    >>()
    expectTypeOf<t.Infer<typeof case7>>()
      .toEqualTypeOf<number>()
  })
  test('throw error when no args', () => {
    expect(() => (
      // @ts-expect-error - TS2345: Argument of type [] is not assignable to parameter of type readonly [any, ...any[]]
      t.intersect([])
    )).toThrowError()
  })
  test('instance.and', () => {
    const case0_0 = t.union([1, 2, '3']).and(String)
    const case0_1 = t.union([1, 2, '3']).and(t(String))
    const case0_2 = t.union([1, 2, '3']).and(t.string())
    expect(case0_0).toStrictEqual(t.intersect([t.union([1, 2, '3']), String]))
    expect(case0_1).toStrictEqual(case0_0)
    expect(case0_2).toStrictEqual(case0_0)
    expectTypeOf(case0_0).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['union'], [
            t.Schema<1, 1>,
            t.Schema<2, 2>,
            t.Schema<'3', '3'>
          ]>, 1 | 2 | '3'>,
          t.Schema<StringConstructor, string>
        ]
      >,
      '3'
    >>()
    expectTypeOf<t.Infer<typeof case0_0>>()
      .toEqualTypeOf<'3'>()
    expectTypeOf(case0_0).toEqualTypeOf<typeof case0_1>()
    expectTypeOf(case0_0).toEqualTypeOf<typeof case0_2>()

    const case1 = t(String).and(t({}))
    expect(case1).toStrictEqual(t.intersection([t.string(), t({})]))
    expectTypeOf(case1).toEqualTypeOf<
      t.Schema<StringConstructor, string & {}>
    >()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<string>()
    type Case1 = t.Infer<typeof case1>
    //   ^?

    const case2 = t(String).and(t.unknown())
    expect(case2).toStrictEqual(t.intersection([t.string(), t.unknown()]))
    expectTypeOf(case2).toEqualTypeOf<
      t.Schema<StringConstructor, string & {}>
    >()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<string>()
    type Case2 = t.Infer<typeof case2>
    //   ^?

    const case3 = t.union(['11', '22', '33', t(String).and(t.unknown())])
    expect(case3).toStrictEqual(t.union([
      '11', '22', '33',
      t.intersection([t.string(), t.unknown()])
    ]))
    expectTypeOf(case3).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['union'], [
          t.Schema<'11', '11'>,
          t.Schema<'22', '22'>,
          t.Schema<'33', '33'>,
          t.Schema<StringConstructor, string & {}>
        ]
      >,
      '11' | '22' | '33' | (string & {})
    >>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<'11' | '22' | '33' | (string & {})>()
    type Case3 = t.Infer<typeof case3>
    //   ^?

    const case4 = t
      .union(['a1', 'ab', 'atrue'])
      .and(t.literal(`a${t.literal.String}`))
      .and(t.literal(`a${t.literal.Number}`))
    expect(case4).toStrictEqual(t.intersection([
      t.union(['a1', 'ab', 'atrue']),
      t.literal(`a${t.literal.String}`),
      t.literal(`a${t.literal.Number}`)
    ]))
    expectTypeOf(case4).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['union'], [
            t.Schema<'a1', 'a1'>,
            t.Schema<'ab', 'ab'>,
            t.Schema<'atrue', 'atrue'>
          ]>, 'a1' | 'ab' | 'atrue'>,
          t.Schema<`a${string}`, `a${string}`>,
          t.Schema<`a${number}`, `a${number}`>
        ]
      >,
      'a1'
    >>()
  })
  test('pick up literal', () => {
    type T0 = ('a' | 'ab' | 'b') & `a${string}`
    //   ^?
    const case0 = t.intersect([
      t.union(['a', 'ab', 'b']),
      `a${t.literal.String}`
    ])
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['union'], [
            t.Schema<'a', 'a'>,
            t.Schema<'ab', 'ab'>,
            t.Schema<'b', 'b'>
          ]>, 'a' | 'ab' | 'b'>,
          t.Schema<`a${string}`, `a${string}`>
        ]
      >,
      'a' | 'ab'
    >>()
    expectTypeOf<t.Infer<typeof case0>>().toEqualTypeOf<T0>()

    type T1 = ('a' | 'ax' | 'a12' | 'b') & `a${number}`
    //   ^?
    const case1 = t.intersect([
      t.union(['a', 'ax', 'a12', 'b']),
      `a${t.literal.Number}`
    ])
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<t.SpecialShape<t.SpecialShapeTypeMapping['union'], [
            t.Schema<'a', 'a'>,
            t.Schema<'ax', 'ax'>,
            t.Schema<'a12', 'a12'>,
            t.Schema<'b', 'b'>
          ]>, 'a' | 'ax' | 'a12' | 'b'>,
          t.Schema<`a${number}`, `a${number}`>
        ]
      >,
      'a12'
    >>()
    expectTypeOf<t.Infer<typeof case1>>().toEqualTypeOf<T1>()
  })
})
