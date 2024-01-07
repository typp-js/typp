import { expect, test } from 'vitest'

// no default consumers, so we should import from the `base` path module
import { t } from '../src/base'

test('base', () => {
  const dispose = t.defineConsumer(() => [1])
  expect(t().shape).toEqual(1)
  dispose()
  expect(t().shape).toEqual(undefined)
})

test('return `Schema` shelf when argument is `Schema`', () => {
  const dispose = t.defineConsumer((...args) => {
    if (args.length === 0) return [1]
  })
  expect(t().shape).toEqual(1)
  expect(t(1).shape).toEqual(undefined)

  const skmWithSymbol = Object.assign(t(), {
    __test__: Symbol('test')
  })
  expect(t(skmWithSymbol)).toEqual(skmWithSymbol)
})
