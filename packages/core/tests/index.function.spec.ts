import { describe, expect, expectTypeOf, test } from 'vitest'

import { t } from '../src'

describe('function', () => {
  test('base', () => {
    const base0_0 = t.function([])
    const base0_1 = t(Function)
    const [shape0_0, shape0_1] = [base0_0.shape, base0_1.shape]
    expect(shape0_0).toEqual(shape0_1)
    expect(shape0_0).toEqual(t.specialShape(t.specialShapeTypeMapping.function, [
      [],
      t.void()
    ]))
    expectTypeOf(base0_0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [],
        t.Schema<typeof t.Symbols.void, void>
      ]>,
      () => void
    >>()
    expectTypeOf<t.Infer<typeof base0_0>>()
      .toEqualTypeOf<() => void>()
    expectTypeOf(base0_0).toEqualTypeOf(base0_1)

    const base1_0 = t.function([String, Number])
    const base1_1 = t(Function, [String, Number])
    const [shape1_0, shape1_1] = [base1_0.shape, base1_1.shape]
    expect(shape1_0).toEqual(shape1_1)
    expect(shape1_0).toEqual(t.specialShape(t.specialShapeTypeMapping.function, [
      [t.string(), t.number()],
      t.void()
    ]))
    expectTypeOf(base1_0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [t.Schema<StringConstructor, string>, t.Schema<NumberConstructor, number>],
        t.Schema<typeof t.Symbols.void, void>
      ]>,
      (a: string, b: number) => void
    >>()
    expectTypeOf<t.Infer<typeof base1_0>>()
      .toEqualTypeOf<(a: string, b: number) => void>()
    expectTypeOf(base1_0).toEqualTypeOf(base1_1)

    const base2_0 = t.function([String, Number], String)
    const base2_1 = t(Function, [String, Number], String)
    const [shape2_0, shape2_1] = [base2_0.shape, base2_1.shape]
    expect(shape2_0).toEqual(shape2_1)
    expect(shape2_0).toEqual(t.specialShape(t.specialShapeTypeMapping.function, [
      [t.string(), t.number()],
      t.string()
    ]))
    expectTypeOf(base2_0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [t.Schema<StringConstructor, string>, t.Schema<NumberConstructor, number>],
        t.Schema<StringConstructor, string>
      ]>,
      (a: string, b: number) => string
    >>()
    expectTypeOf<t.Infer<typeof base2_0>>()
      .toEqualTypeOf<(a: string, b: number) => string>()
    expectTypeOf(base2_0).toEqualTypeOf(base2_1)

    const base3_0 = t.function([], Map, Number, String)
    const base3_1 = t(Function, [], Map, Number, String)
    expectTypeOf(base3_0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [],
        t.Schema<
          t.Map<
            t.Schema<NumberConstructor, number>,
            t.Schema<StringConstructor, string>
          >,
          Map<number, string>
        >
      ]>,
      () => Map<number, string>
    >>()
    expectTypeOf<t.Infer<typeof base3_0>>()
      .toEqualTypeOf<() => Map<number, string>>()
    expectTypeOf(base3_0).toEqualTypeOf(base3_1)
  })
  test('generic in args', () => {
    const skm = t(Function, [t.generic('T', t.string())])
    expectTypeOf(skm).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [t.GenericSchema<t.Generic<'T', t.Schema<StringConstructor, string>, never>>],
        t.Schema<typeof t.Symbols.void, void>
      ]>,
      <T extends string = never>(args_0: T) => void
    >>()
    type Skm = t.Infer<typeof skm>
    expectTypeOf<Skm>().toEqualTypeOf<<T extends string = never>(args_0: T) => void>()
    // @ts-expect-error
    expectTypeOf<Skm>().toEqualTypeOf<<T extends number = never>(args_0: T) => void>()
    // @ts-expect-error
    expectTypeOf<Skm>().toEqualTypeOf<<T extends string = number>(args_0: T) => void>()
    // @ts-expect-error
    expectTypeOf<Skm>().toEqualTypeOf<<T extends string = never>(args_0: number) => void>()
    // @ts-expect-error
    expectTypeOf<Skm>().toEqualTypeOf<<T extends string = never>(args_0: T) => number>()
    const skmT = (() => void 0) as Skm
    const t0 = skmT('foo')
    expectTypeOf(t0).toEqualTypeOf<void>()
    // @ts-expect-error
    expectTypeOf(t0).toEqualTypeOf<string>()
    // @ts-expect-error
    skmT(1)
  })
  test('generic in `args` and `return`', () => {
    const case0 = t(
      Function, [t.generic('T', t.string())], t.generic('T', t.string())
    )
    expectTypeOf(case0).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [t.GenericSchema<t.Generic<'T', t.Schema<StringConstructor, string>, never>>],
        t.GenericSchema<t.Generic<'T', t.Schema<StringConstructor, string>, never>>
      ]>,
      <T extends string = never>(args_0: T) => T
    >>()
    type Case0T = t.Infer<typeof case0>
    expectTypeOf<Case0T>().toEqualTypeOf<<T extends string = never>(args_0: T) => T>()
    // @ts-expect-error
    expectTypeOf<Case0T>().toEqualTypeOf<<T extends number = never>(args_0: T) => T>()
    // @ts-expect-error
    expectTypeOf<Case0T>().toEqualTypeOf<<T extends string = number>(args_0: T) => T>()
    // @ts-expect-error
    expectTypeOf<Case0T>().toEqualTypeOf<<T extends string = never>(args_0: number) => T>()
    // @ts-expect-error
    expectTypeOf<Case0T>().toEqualTypeOf<<T extends string = never>(args_0: T) => number>()

    const case0T = (() => void 0) as Case0T
    const t0 = case0T('foo')
    expectTypeOf(t0).toEqualTypeOf<'foo'>()
    // @ts-expect-error
    expectTypeOf(t0).toEqualTypeOf<string>()
    // @ts-expect-error
    case0T(1)
  })
  test('generic in `args` nested structure', () => {
    const T = t.generic('T', t.string())
    const arraySkm = t(Function, [t(Array, T)])
    type TSkm = typeof T
    expectTypeOf(arraySkm).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [t.Schema<
          t.GenericSchema<TSkm['schemas']>[],
          TSkm['schemas'][]
        >],
        t.Schema<typeof t.Symbols.void, void>
      ]>,
      <T extends string = never>(args_0: T[]) => void
    >>()
    expectTypeOf<t.Infer<typeof arraySkm>>()
      .toEqualTypeOf<<T extends string = never>(args_0: T[]) => void>()

    const tupleSkm = t(Function, [t([T])])
    expectTypeOf(tupleSkm).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [t.Schema<
          [t.GenericSchema<TSkm['schemas']>],
          [TSkm['schemas']]
        >],
        t.Schema<typeof t.Symbols.void, void>
      ]>,
      <T extends string = never>(args_0: [T]) => void
    >>()
    expectTypeOf<t.Infer<typeof tupleSkm>>()
      .toEqualTypeOf<<T extends string = never>(args_0: [T]) => void>()
    const tupleSkmT = (() => void 0) as t.Infer<typeof tupleSkm>
    tupleSkmT(['foo'])
    // @ts-expect-error
    tupleSkmT([1])
    // @ts-expect-error
    tupleSkmT(['foo', 'bar'])
    // @ts-expect-error
    tupleSkmT([])

    const objectSkm = t(Function, [t({ foo: T })])
    expectTypeOf(objectSkm).toEqualTypeOf<t.Schema<
      t.SpecialShape<t.SpecialShapeTypeMapping['function'], [
        [t.Schema<
          { foo: t.GenericSchema<TSkm['schemas']> },
          { foo: TSkm['schemas'] }
        >],
        t.Schema<typeof t.Symbols.void, void>
      ]>,
      <T extends string = never>(args_0: { foo: T }) => void
    >>()
    expectTypeOf<t.Infer<typeof objectSkm>>()
      .toEqualTypeOf<<T extends string = never>(args_0: { foo: T }) => void>()
    const objectSkmT = (() => void 0) as t.Infer<typeof objectSkm>
    objectSkmT({ foo: 'foo' })
    // @ts-expect-error
    objectSkmT({ foo: 1 })
  })
  test('`implement` instance method', () => {
    const case0 = t.function([], String)
    const case0Impl = case0.implement(() => 'test')
    expectTypeOf(case0Impl).toEqualTypeOf<() => string>()
    // `Schema<any, any>` is not contains `implements` method which is only defined in `Schema<Function, any>`
    // @ts-expect-error
    t([]).implement
  })
})
