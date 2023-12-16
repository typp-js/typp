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
    expectTypeOf(case2).toEqualTypeOf<t.Schema<true, true>>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<true>()
    const case3 = t(false)
    expectTypeOf(case3).toEqualTypeOf<t.Schema<false, false>>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<false>()
    const case4 = t('')
    expectTypeOf(case4).toEqualTypeOf<t.Schema<'', ''>>()
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<''>()
    const case5 = t(0)
    expectTypeOf(case5).toEqualTypeOf<t.Schema<0, 0>>()
    expectTypeOf<t.Infer<typeof case5>>()
      .toEqualTypeOf<0>()
    const case6 = t(1)
    expectTypeOf(case6).toEqualTypeOf<t.Schema<1, 1>>()
    expectTypeOf<t.Infer<typeof case6>>()
      .toEqualTypeOf<1>()
    const case7 = t(Symbol())
    expectTypeOf(case7).toEqualTypeOf<t.Schema<symbol, symbol>>()
    expectTypeOf<t.Infer<typeof case7>>()
      .toEqualTypeOf<symbol>()
    const case8 = t(0n)
    expectTypeOf(case8).toEqualTypeOf<t.Schema<0n, 0n>>()
    expectTypeOf<t.Infer<typeof case8>>()
      .toEqualTypeOf<0n>()

    // @ts-expect-error - Argument of type ObjectConstructor is not assignable to parameter of type
    // string | number | bigint | boolean | symbol | null | undefined
    t.const(Object)
    // @ts-expect-error - Argument of type ObjectConstructor is not assignable to parameter of type
    // string | number | bigint | boolean | symbol | null | undefined
    t.literal(Object)
  })
  test('special type', () => {
    const case0 = t.void()
    expectTypeOf(case0).toEqualTypeOf<t.Schema<typeof t.Symbols.void, void>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<void>()
    const case1 = t.unknown()
    expectTypeOf(case1).toEqualTypeOf<t.Schema<typeof t.Symbols.unknown, unknown>>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<unknown>()
    const case2 = t.never()
    expectTypeOf(case2).toEqualTypeOf<t.Schema<typeof t.Symbols.never, never>>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<never>()
    const case3 = t.any()
    expectTypeOf(case3).toEqualTypeOf<t.Schema<any, any>>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<any>()
  })
  test('template literal', () => {
    const case0 = t.literal(`a${String}`)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      `a${string}`, `a${string}`
    >>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<`a${string}`>()
    const case1 = t.literal(`a${0 as number}`)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      `a${number}`, `a${number}`
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<`a${number}`>()
    const case2 = t.literal(`a${t.literal.Boolean}`)
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      `a${boolean}`, `a${boolean}`
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<`a${boolean}`>()
    const case3 = t.literal(`a${t.literal.Null}`)
    expectTypeOf(case3).toEqualTypeOf<t.Schema<
      `a${null}`, `a${null}`
    >>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<`a${null}`>()
    const case4 = t.literal(`a${t.literal.Undefined}`)
    expectTypeOf(case4).toEqualTypeOf<t.Schema<
      `a${undefined}`, `a${undefined}`
    >>()
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<`a${undefined}`>()

    const case5 = t(`a${t.literal.String}`)
    expectTypeOf(case5).toEqualTypeOf<t.Schema<
      `a${string}`, `a${string}`
    >>()
    expectTypeOf<t.Infer<typeof case5>>()
      .toEqualTypeOf<`a${string}`>()
    const case6 = t(`a${t.literal.Number}`)
    expectTypeOf(case6).toEqualTypeOf<t.Schema<
      `a${number}`, `a${number}`
    >>()
    expectTypeOf<t.Infer<typeof case6>>()
      .toEqualTypeOf<`a${number}`>()
    const case7 = t(`a${t.literal.Boolean}`)
    expectTypeOf(case7).toEqualTypeOf<t.Schema<
      `a${boolean}`, `a${boolean}`
    >>()
    expectTypeOf<t.Infer<typeof case7>>()
      .toEqualTypeOf<`a${boolean}`>()
    const case8 = t(`a${t.literal.Null}`)
    expectTypeOf(case8).toEqualTypeOf<t.Schema<
      `a${null}`, `a${null}`
    >>()
    expectTypeOf<t.Infer<typeof case8>>()
      .toEqualTypeOf<`a${null}`>()
    const case9 = t(`a${t.literal.Undefined}`)
    expectTypeOf(case9).toEqualTypeOf<t.Schema<
      `a${undefined}`, `a${undefined}`
    >>()
    expectTypeOf<t.Infer<typeof case9>>()
      .toEqualTypeOf<`a${undefined}`>()
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
      t.Schema<StringConstructor, string>
    >()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<string>()
    type Case2 = t.Infer<typeof case2>
    //   ^?
    const case3 = t(String).and(t.unknown())
    expectTypeOf(case3).toEqualTypeOf<
      t.Schema<StringConstructor, string>
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
          t.Schema<StringConstructor, string>
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
