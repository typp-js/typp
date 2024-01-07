import { expect, expectTypeOf, test, vi } from 'vitest'

// no default consumers, so we should import from the `base` path module
import { t } from '../src/base'

declare module '../src/base' {
  namespace t {
    interface SchemaFieldsAll<Shape, T> {
      __test: number
      readonly __test_getter: string
    }
  }
}

test('base', () => {
  const dispose = t.defineFields(() => ({ __test: 1 }))
  const skm = t()
  expectTypeOf(skm.__test).toEqualTypeOf<number>()
  expect(skm.__test).toBe(1)
  dispose()
  expect(t().__test).toBeUndefined()
})
test('base - with getter', () => {
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
  expect(t().__test_getter).toBeUndefined()
})
