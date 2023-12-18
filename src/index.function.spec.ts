import { describe, expectTypeOf, test } from 'vitest'
import { t } from '.'

describe('function', () => {
  test('base', () => {
    const base0_0 = t.function([])
    const base0_1 = t(Function)
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
        [t.Schema<
          t.SpecialShape<
            t.SpecialShapeTypeMapping['generic'],
            t.Generic<'T', t.Schema<StringConstructor, string>, never>
          >,
          t.Generic<'T', t.Schema<StringConstructor, string>, never>
        >],
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
        [t.Schema<
          t.SpecialShape<
            t.SpecialShapeTypeMapping['generic'],
            t.Generic<'T', t.Schema<StringConstructor, string>, never>
          >,
          t.Generic<'T', t.Schema<StringConstructor, string>, never>
        >],
        t.Schema<
          t.SpecialShape<
            t.SpecialShapeTypeMapping['generic'],
            t.Generic<'T', t.Schema<StringConstructor, string>, never>
          >,
          t.Generic<'T', t.Schema<StringConstructor, string>, never>
        >
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
})
