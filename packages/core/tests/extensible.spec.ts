import { t } from '@typp/core'
import { expect, test } from 'vitest'

declare module '@typp/core' {
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
test('can not refine static field "CANT_REFINE"', () => {
  expect(() => {
    // @ts-expect-error
    t.defineStatic('CANT_REFINE', 1)
  }).toThrow()
})
