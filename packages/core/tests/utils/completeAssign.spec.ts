import { expect, test } from 'vitest'

import { completeAssign } from '../../src/utils/completeAssign'

test('base', () => {
  const target = { a: 1 }
  const source = { b: 2 }
  const result = completeAssign(target, source)
  expect(result).toEqual({ a: 1, b: 2 })
  expect(result).toBe(target)
  expect(result).not.toBe(source)
})
test('symbol', () => {
  const target = { a: 1 }
  const bsym = Symbol('b')
  const source = { [bsym]: 2 }
  const result = completeAssign(target, source)
  expect(result).toEqual({ a: 1, [bsym]: 2 })
  expect(result).toBe(target)
  expect(result).not.toBe(source)
})
test('symbol enumerable', () => {
  const target = { a: 1 }
  const bsym = Symbol('b')
  const source = { [bsym]: 2 }
  Object.defineProperty(source, bsym, {
    enumerable: false,
    value: 2
  })
  const result = completeAssign(target, source)
  expect(result).toEqual({ a: 1 })
  expect(result).toBe(target)
  expect(result).not.toBe(source)
})
