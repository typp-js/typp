import { expect, test } from 'vitest'

import { t } from '../src'

declare module '../src' {
  namespace t {
    export function ____foo(): string
    export const ____bar: number
  }
}

test('base', () => {
  let dispose: () => void
  dispose = t.defineStatic('____foo', () => 'foo')
  expect(t.____foo()).toBe('foo')
  dispose()
  expect(t.____foo).toBeUndefined()
  // @ts-expect-error
  dispose = t.defineStatic('____foo', 'foo')
  dispose()
})
test('throw Error when static field is existed', () => {
  t.defineStatic('____bar', 1)
  expect(() => {
    t.defineStatic('____bar', 2)
  }).toThrow()
})
test('when override is true, will override the existed static field and not throw Error', () => {
  t.defineStatic('____bar', 1)
  t.defineStatic('____bar', 2, { override: true })
  expect(t.____bar).toBe(2)
})
