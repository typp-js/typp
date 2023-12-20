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
