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
  })
  test('generic', () => {
    // type T0 = [
    //   [a: Generic<'T', string, never>, number],
    //   string
    // ]
    // //   _?
    // type T1 = [T0] extends [[infer Args, infer RT]] ? (
    //   <T extends Args[0]['extends'] = Args[0]['default']>(...args: t.Replace<T, Args>) => RT
    //   ) : never
    // 1. 将 Args 中定义的 Schema 替换为对应的类型，而 Generic 类型不做替换
    // 2. 将 Args 中的 Generic 数量统计出来，选择到对应数量的泛型函数
    // 3. 泛型参数的相关信息填充到对应的位置中去
    // 4. 将函数参数以及返回值中的「泛型类型」替换为函数对应的「泛型参数」

    // const foo = t((a = generic('T', String), b = Number) => String)
    // const fuo = t((a = generic('T', String), b = Number) => String, [generic('T', String), Number])
    // const fuu = t((a = generic('T', String), b = Number) => [String, a, b])
    // const fou = t((a = generic('T', String), b = Number) => [String, [a, b]])
    // const baz = t(Function, [generic('T', String), Number], String)
    // const bar = t.function([generic('T', String), Number], String)

  })
})
