import '../src/calc'

import { describe, expectTypeOf, test } from 'vitest'

import { t } from '../src'

describe('union', () => {
  test('base', () => {
    const case0 = t.union([])
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      typeof t.Symbols.never, never
    >>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<never>()
    const case1 = t.union([Number])
    expectTypeOf(case1).toEqualTypeOf<t.Schema<NumberConstructor, number>>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<number>()
    const case2 = t.union([Number, String])
    const case2_1 = t(Number).or(String)
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
    expectTypeOf(case2_1).toEqualTypeOf<typeof case2>()
    const case3 = t.union([1, 2, '3', true, null, undefined])
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
})

describe('intersect', () => {
  test('base', () => {
    // @ts-expect-error - Source has 0 element(s) but target requires 1
    t.intersect([])

    const case0 = t.intersect([1])
    expectTypeOf(case0).toEqualTypeOf<t.Schema<1, 1>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<1>()

    const case1 = t.intersect([1, Number])
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
    expectTypeOf(case3).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<typeof t.Symbols.unknown, unknown>
        ]
      >,
      number
    >>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<number>()

    const case4 = t.intersect([Number, t.never()])
    expectTypeOf(case4).toEqualTypeOf<t.Schema<
      t.SpecialShape<
        t.SpecialShapeTypeMapping['intersection'], [
          t.Schema<NumberConstructor, number>,
          t.Schema<typeof t.Symbols.never, never>
        ]
      >,
      never
    >>()
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<never>()

    const case5 = t.intersect([Number, t.any()])
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
  test('instance.and', () => {
    const case0 = t.union([1, 2, '3']).and(String)
    //    ^?
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
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
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<'3'>()
    const case1 = t.union([1, 2, '3']).and(t.string())
    expectTypeOf(case1).toEqualTypeOf<typeof case0>()

    const case2 = t(String).and(t({}))
    expectTypeOf(case2).toEqualTypeOf<
      t.Schema<StringConstructor, string & {}>
    >()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<string>()
    type Case2 = t.Infer<typeof case2>
    //   ^?
    const case3 = t(String).and(t.unknown())
    expectTypeOf(case3).toEqualTypeOf<
      t.Schema<StringConstructor, string & {}>
    >()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<string>()
    type Case3 = t.Infer<typeof case3>
    //   ^?
    const case4 = t.union(['11', '22', '33', t(String).and(t.unknown())])
    expectTypeOf(case4).toEqualTypeOf<t.Schema<
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
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<'11' | '22' | '33' | (string & {})>()
    type Case4 = t.Infer<typeof case4>
    //   ^?
  })
  test('pick up literal', () => {
    type T0 = ('a' | 'ab' | 'b') & `a${string}`
    //   ^?
    const case0 = t.intersect([
      t.union(['a', 'ab', 'b']),
      t(`a${t.literal.String}`)
      // TODO support no `t` function wrap?
      // `a${String}`
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
      `a${0 as number}`
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
