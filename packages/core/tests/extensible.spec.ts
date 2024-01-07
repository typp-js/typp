import { describe, expect, test } from 'vitest'

import { t } from '../src'

declare module '@typp/core' {
  namespace t {
    export function ____foo(): string
    export const ____bar: number
    export const ____baz: number
  }
}

describe('defineStatic', () => {
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
    const dispose = t.defineStatic('____bar', 1)
    expect(() => {
      t.defineStatic('____bar', 2)
    }).toThrow()
    dispose()
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
})
describe('defineStatic.proxy', () => {
  test('base', () => {
    const disposeBarStaticDefine0 = t.defineStatic('____bar', 1)
    expect(t.____bar).toBe(1)
    const disposeBazStaticDefine = t.defineStatic.proxy('____bar', '____baz')
    expect(t.____baz).toBe(1)

    disposeBarStaticDefine0()
    const disposeBarStaticDefine1 = t.defineStatic('____bar', 2)
    expect(t.____baz).toBe(2)

    disposeBarStaticDefine1()
    expect(t.____bar).toBeUndefined()
    expect(t.____baz).toBeUndefined()
    disposeBazStaticDefine()
  })
  test('throw Error when nativeKey is not existed', () => {
    expect(() => {
      t.defineStatic.proxy('____foo', '____bar')
    }).toThrow()
  })
  test('throw Error when proxyKey is existed', () => {
    expect(() => {
      t.defineStatic.proxy('____bar', '____foo')
    }).toThrow()
  })
  test('can not refine static field "CANT_REFINE"', () => {
    expect(() => {
      // @ts-expect-error
      t.defineStatic.proxy('____foo', 'CANT_REFINE')
    }).toThrow()
  })
  test('can not refine self', () => {
    expect(() => {
      // @ts-expect-error
      t.defineStatic.proxy('____foo', '____foo')
    }).toThrow()
  })
})
