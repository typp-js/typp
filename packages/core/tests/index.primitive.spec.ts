import { describe, expectTypeOf, test } from 'vitest'

import { t } from '../src'

test('base', () => {
  const cases = [
    [t(String), String, {} as string],
    [t(Number), Number, {} as number],
    [t(Boolean), Boolean, {} as boolean],
    [t(Symbol), Symbol, {} as symbol],
    [t(BigInt), BigInt, {} as bigint]
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
