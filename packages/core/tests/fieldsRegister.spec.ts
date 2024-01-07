import { expect, expectTypeOf, test, vi } from 'vitest'

// no default consumers, so we should import from the `base` path module
import { t } from '../src/base'

declare module '../src/base' {
  namespace t {
    interface SchemaFieldsAll<Shape, T> {
      __test: number
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
