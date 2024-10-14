import { expect, test } from 'vitest'

// no default consumers, so we should import from the `base` path module
import { t } from '#~/base.ts'

test('base', () => {
  const dispose = t.useConsumer(() => [1])
  expect(t().shape).toEqual(1)
  dispose()
  expect(t().shape).toEqual(undefined)
})

test('return `Schema` shelf when argument is `Schema`', () => {
  const dispose = t.useConsumer((...args) => {
    if (args.length === 0) return [1]
  })
  expect(t().shape).toEqual(1)
  expect(t(1).shape).toEqual(undefined)

  const skmWithSymbol = Object.assign(t(), {
    __test__: Symbol('test')
  })
  expect(t(skmWithSymbol)).toEqual(skmWithSymbol)
})
