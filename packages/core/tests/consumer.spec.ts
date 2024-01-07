import { expect, test } from 'vitest'

// no default consumers, so we should import from the `base` path module
import { t } from '../src/base'

test('base', () => {
  const dispose = t.defineConsumer(() => [1])
  expect(t().shape).toEqual(1)
  dispose()
  expect(t().shape).toEqual(undefined)
})
