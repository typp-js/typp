import primitive from '#~/consumers/primitive.ts'

import { t } from '@typp/core/base'

import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'
import ConstructorMapping = t.ConstructorMapping

beforeAll(() => t.use(primitive))

test('constructorMapping', () => {
  expectTypeOf<ConstructorMapping<StringConstructor>>()
    .toMatchTypeOf<string>()

  expectTypeOf<ConstructorMapping<NumberConstructor>>()
    .toMatchTypeOf<number>()

  // don't resolve tuple type
  expectTypeOf<ConstructorMapping<[NumberConstructor]>>()
    .toMatchTypeOf<never>()
  expectTypeOf<ConstructorMapping<[NumberConstructor, StringConstructor]>>()
    .toMatchTypeOf<never>()

  // don't resolve object type
  expectTypeOf<ConstructorMapping<{
    foo: NumberConstructor
  }>>()
    .toMatchTypeOf<never>()

  expectTypeOf<ConstructorMapping<never>>()
    .toMatchTypeOf<never>()
  expectTypeOf<ConstructorMapping<unknown>>()
    .toMatchTypeOf<never>()
  expectTypeOf<ConstructorMapping<{}>>()
    .toMatchTypeOf<never>()
  expectTypeOf<ConstructorMapping<any>>()
    .toMatchTypeOf<never>()
})

describe('primitive', () => {
  test('creat by Constructor', () => {
    const cases = [
      [t(String), String, {} as string],
      [t(Number), Number, {} as number],
      [t(BigInt), BigInt, {} as bigint],
      [t(Boolean), Boolean, {} as boolean],
      [t(Symbol), Symbol, {} as symbol],
      [t(Date), Date, {} as Date],
      [t(RegExp), RegExp, {} as RegExp]
    ] as const
    expect(cases[0][0].shape).toBe(String)
    expectTypeOf(cases[0][0])
      .toEqualTypeOf<t.Schema<typeof cases[0][1], typeof cases[0][2]>>()
    expectTypeOf<t.Infer<typeof cases[0][0]>>()
      .toEqualTypeOf<typeof cases[0][2]>()
    expect(cases[1][0].shape).toBe(Number)
    expectTypeOf(cases[1][0])
      .toEqualTypeOf<t.Schema<typeof cases[1][1], typeof cases[1][2]>>()
    expectTypeOf<t.Infer<typeof cases[1][0]>>()
      .toEqualTypeOf<typeof cases[1][2]>()
    expect(cases[2][0].shape).toBe(BigInt)
    expectTypeOf(cases[2][0])
      .toEqualTypeOf<t.Schema<typeof cases[2][1], typeof cases[2][2]>>()
    expectTypeOf<t.Infer<typeof cases[2][0]>>()
      .toEqualTypeOf<typeof cases[2][2]>()
    expect(cases[3][0].shape).toBe(Boolean)
    expectTypeOf(cases[3][0])
      .toEqualTypeOf<t.Schema<typeof cases[3][1], typeof cases[3][2]>>()
    expectTypeOf<t.Infer<typeof cases[3][0]>>()
      .toEqualTypeOf<typeof cases[3][2]>()
    expect(cases[4][0].shape).toBe(Symbol)
    expectTypeOf(cases[4][0])
      .toEqualTypeOf<t.Schema<typeof cases[4][1], typeof cases[4][2]>>()
    expectTypeOf<t.Infer<typeof cases[4][0]>>()
      .toEqualTypeOf<typeof cases[4][2]>()
    expect(cases[5][0].shape).toBe(Date)
    expectTypeOf(cases[5][0])
      .toEqualTypeOf<t.Schema<typeof cases[5][1], typeof cases[5][2]>>()
    expectTypeOf<t.Infer<typeof cases[5][0]>>()
      .toEqualTypeOf<typeof cases[5][2]>()
    expect(cases[6][0].shape).toBe(RegExp)
    expectTypeOf(cases[6][0])
      .toEqualTypeOf<t.Schema<typeof cases[6][1], typeof cases[6][2]>>()
    expectTypeOf<t.Infer<typeof cases[6][0]>>()
      .toEqualTypeOf<typeof cases[6][2]>()
  })
  test('creat by static function', () => {
    const cases = [
      [t.string(), String, {} as string],
      [t.number(), Number, {} as number],
      [t.bigint(), BigInt, {} as bigint],
      [t.boolean(), Boolean, {} as boolean],
      [t.symbol(), Symbol, {} as symbol],
      [t.date(), Date, {} as Date],
      [t.regexp(), RegExp, {} as RegExp]
    ] as const

    for (const [schema, shape] of cases) {
      expect(schema.shape).toBe(shape)
    }
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
    expectTypeOf(cases[5][0])
      .toEqualTypeOf<t.Schema<typeof cases[5][1], typeof cases[5][2]>>()
    expectTypeOf<t.Infer<typeof cases[5][0]>>()
      .toEqualTypeOf<typeof cases[5][2]>()
    expectTypeOf(cases[6][0])
      .toEqualTypeOf<t.Schema<typeof cases[6][1], typeof cases[6][2]>>()
    expectTypeOf<t.Infer<typeof cases[6][0]>>()
      .toEqualTypeOf<typeof cases[6][2]>()
  })
  test('empty args', () => {
    const anySchema = t()
    expect(anySchema.shape.type).toBe(t.Symbols.any)
    expectTypeOf(anySchema).toEqualTypeOf<t.Schema<any, any>>()
    expectTypeOf<t.Infer<typeof anySchema>>()
      .toEqualTypeOf<any>()
  })
  test('literal primitive value type', () => {
    const nullSkm = t(null)
    const nullSkmByStatic = t.null()
    expect(nullSkm.shape).toBe(null)
    expect(nullSkm).toStrictEqual(nullSkmByStatic)
    expectTypeOf(nullSkm).toEqualTypeOf<t.Schema<null, null>>()
    expectTypeOf<t.Infer<typeof nullSkm>>()
      .toEqualTypeOf<null>()
    expectTypeOf(nullSkmByStatic).toEqualTypeOf<typeof nullSkm>()

    const undefinedSkm = t(undefined)
    const undefinedSkmByStatic = t.undefined()
    expect(undefinedSkm.shape).toBe(undefined)
    expect(undefinedSkm).toStrictEqual(undefinedSkmByStatic)
    expectTypeOf(undefinedSkm).toEqualTypeOf<t.Schema<undefined, undefined>>()
    expectTypeOf<t.Infer<typeof undefinedSkm>>()
      .toEqualTypeOf<undefined>()
    expectTypeOf(undefinedSkmByStatic).toEqualTypeOf<typeof undefinedSkm>()
  })
  test('special type', () => {
    const anySkm = t.any()
    expect(anySkm.shape.type).toBe(t.Symbols.any)
    expectTypeOf(anySkm).toEqualTypeOf<t.Schema<any, any>>()
    expectTypeOf<t.Infer<typeof anySkm>>()
      .toEqualTypeOf<any>()
    const unknownSkm = t.unknown()
    expect(unknownSkm.shape.type).toBe(t.Symbols.unknown)
    expectTypeOf(unknownSkm).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['unknown']>,
      unknown
    >>()
    expectTypeOf<t.Infer<typeof unknownSkm>>()
      .toEqualTypeOf<unknown>()
    const neverSkm = t.never()
    expect(neverSkm.shape.type).toBe(t.Symbols.never)
    expectTypeOf(neverSkm).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['never']>,
      never
    >>()
    expectTypeOf<t.Infer<typeof neverSkm>>()
      .toEqualTypeOf<never>()
    const voidSkm = t.void()
    expect(voidSkm.shape.type).toBe(t.Symbols.void)
    expectTypeOf(voidSkm).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['void']>,
      void
    >>()
    expectTypeOf<t.Infer<typeof voidSkm>>()
      .toEqualTypeOf<void>()
  })
})

describe('literal', () => {
  test('base', () => {
    const case0 = t(null)
    expect(case0.shape).toBe(null)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<null, null>>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<null>()
    const case1 = t(undefined)
    expect(case1.shape).toBe(undefined)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<undefined, undefined>>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<undefined>()

    const case2 = t(true)
    expect(case2.shape).toBe(true)
    expectTypeOf(case2).toEqualTypeOf<t.Schema<true, true>>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<true>()
    const case3 = t(false)
    expect(case3.shape).toBe(false)
    expectTypeOf(case3).toEqualTypeOf<t.Schema<false, false>>()
    expectTypeOf<t.Infer<typeof case3>>()
      .toEqualTypeOf<false>()
    const case4 = t('')
    expect(case4.shape).toBe('')
    expectTypeOf(case4).toEqualTypeOf<t.Schema<'', ''>>()
    expectTypeOf<t.Infer<typeof case4>>()
      .toEqualTypeOf<''>()
    const case5 = t(0)
    expect(case5.shape).toBe(0)
    expectTypeOf(case5).toEqualTypeOf<t.Schema<0, 0>>()
    expectTypeOf<t.Infer<typeof case5>>()
      .toEqualTypeOf<0>()
    const case6 = t(1)
    expect(case6.shape).toBe(1)
    expectTypeOf(case6).toEqualTypeOf<t.Schema<1, 1>>()
    expectTypeOf<t.Infer<typeof case6>>()
      .toEqualTypeOf<1>()
    // eslint-disable-next-line symbol-description
    const sym = Symbol()
    const case7 = t(sym)
    expect(case7.shape).toBe(sym)
    expectTypeOf(case7).toEqualTypeOf<t.Schema<typeof sym, typeof sym>>()
    expectTypeOf<t.Infer<typeof case7>>()
      .toEqualTypeOf<typeof sym>()
    const case8 = t(0n)
    expect(case8.shape).toBe(0n)
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
    expect(case0.shape.type).toBe(t.Symbols.void)
    expect(case0.shape.schemas).toEqual(undefined)
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['void']>,
      void
    >>()
    expectTypeOf<t.Infer<typeof case0>>()
      .toEqualTypeOf<void>()

    const case1 = t.unknown()
    expect(case1.shape.type).toBe(t.Symbols.unknown)
    expect(case1.shape.schemas).toEqual(undefined)
    expectTypeOf(case1).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['unknown']>,
      unknown
    >>()
    expectTypeOf<t.Infer<typeof case1>>()
      .toEqualTypeOf<unknown>()

    const case2 = t.never()
    expect(case2.shape.type).toBe(t.Symbols.never)
    expect(case2.shape.schemas).toEqual(undefined)
    expectTypeOf(case2).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['never']>,
      never
    >>()
    expectTypeOf<t.Infer<typeof case2>>()
      .toEqualTypeOf<never>()

    const case3_0 = t.any()
    const case3_1 = t()
    expect(case3_0.shape.type).toBe(t.Symbols.any)
    expect(case3_1.shape.type).toBe(t.Symbols.any)
    expect(case3_0.shape.schemas).toEqual(undefined)
    expect(case3_1.shape.schemas).toEqual(undefined)
    expectTypeOf(case3_0).toEqualTypeOf<t.Schema<any, any>>()
    expectTypeOf(case3_1).toEqualTypeOf<typeof case3_0>()
    expectTypeOf<t.Infer<typeof case3_0>>()
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
