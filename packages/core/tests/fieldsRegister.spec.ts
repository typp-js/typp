import { beforeAll, expect, expectTypeOf, test } from 'vitest'

// no default consumers, so we should import from the `base` path module
import { t } from '../src/base'
import type { IsNotEqual } from '../src/types'

const onlySymbol = Symbol('only')
declare module '../src/base' {
  namespace t {
    interface SchemaFieldsAll<Shape, T> {
      __test: number
      readonly __test_getter: string
      __test_setter: string
    }
    interface SchemaFieldsEntries<Shape = any, T = any> {
      0: [(
        & ([Shape] extends [{ [onlySymbol]: true }] ? true : false)
        & IsNotEqual<Shape, any>
      ), {
        __test_forSpecialShape: number
      }]
    }
  }
  namespace t {
    export interface ObjectExcludeShapes {
      [onlySymbol]: { [onlySymbol]: true }
    }
    export interface ShapeEntries<T, Rest extends any[]> {
      0: [T extends { [onlySymbol]: true } ? true : false, t.Schema<T, 'This is a unit test special shape type'>]
    }
  }
}

beforeAll(() => t.defineConsumer(first => {
  if (first?.[onlySymbol]) return [first]
}))
test('base', () => {
  const dispose = t.defineFields(() => ({ __test: 1 }))
  const skm = t()
  expectTypeOf(skm.__test).toEqualTypeOf<number>()
  expect(skm.__test).toBe(1)
  dispose()
  expect(t().__test).toBeUndefined()

  // @ts-expect-error
  const badDispose = t.defineFields(() => ({ __test: '1' }))
  badDispose()
})
test('getter', () => {
  let testStr = '1'
  const dispose = t.defineFields(() => ({
    get __test_getter() {
      return testStr
    }
  }))
  const skm = t()
  expectTypeOf(skm.__test_getter).toEqualTypeOf<string>()
  expect(skm.__test_getter).toBe('1')
  testStr = '2'
  expect(skm.__test_getter).toBe('2')
  dispose()
  expect(t()).not.toHaveProperty('__test_getter')
})
test('setter', () => {
  let testStr = '1'
  const dispose = t.defineFields(() => ({
    set __test_setter(v: string) {
      testStr = v
    }
  }))
  const skm = t()
  expectTypeOf(skm.__test_setter).toEqualTypeOf<string>()
  skm.__test_setter = '2'
  expect(testStr).toBe('2')
  dispose()
  expect(t()).not.toHaveProperty('__test_setter')

  // @ts-expect-error
  skm.__test_setter = 1
  // @ts-expect-error
  const badDispose = t.defineFields(() => ({ set __test_setter(v: number) {} }))
  badDispose()
})
test('`IsWhatShape`', () => {
  const isOnlyShape = (shape => true) as t.IsWhatShape<{ [onlySymbol]: true }>
  const disposeFieldsRegister = t.defineFields(isOnlyShape, shape => {
    expectTypeOf(shape).toEqualTypeOf<{ [onlySymbol]: true }>()
    return {
      __test_forSpecialShape: 1
    }
  })
  const skm = t({ [onlySymbol]: true })
  expectTypeOf(skm.__test_forSpecialShape).toEqualTypeOf<number>()
  expect(skm.__test_forSpecialShape).toBe(1)
  disposeFieldsRegister()
  expect(t({ [onlySymbol]: true }).__test_forSpecialShape).toBeUndefined()
})
