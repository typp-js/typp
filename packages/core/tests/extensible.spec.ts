import { t } from '@typp/core/base'

import { describe, expect, test } from 'vitest'

declare module '@typp/core/base' {
  namespace t {
    function ____foo(): string
    const ____bar: number
    const ____baz: number
  }
}

describe('useStatic', () => {
  test('base', () => {
    let dispose: () => void
    dispose = t.useStatic('____foo', () => 'foo')
    expect(t.____foo()).toBe('foo')
    dispose()
    expect(t.____foo).toBeUndefined()
    // @ts-expect-error
    dispose = t.useStatic('____foo', 'foo')
    dispose()
  })
  test('throw Error when static field is existed', () => {
    const dispose = t.useStatic('____bar', 1)
    expect(() => {
      t.useStatic('____bar', 2)
    }).toThrow()
    dispose()
  })
  test('when override is true, will override the existed static field and not throw Error', () => {
    t.useStatic('____bar', 1)
    const dispose = t.useStatic('____bar', 2, { override: true })
    expect(t.____bar).toBe(2)
    dispose()
  })
  test('can not refine static field "CANT_REFINE"', () => {
    expect(() => {
      // @ts-expect-error
      t.useStatic('CANT_REFINE', 1)
    }).toThrow()
  })
})
describe('useStatic.proxy', () => {
  test('base', () => {
    const disposeBarStaticDefine0 = t.useStatic('____bar', 1)
    expect(t.____bar).toBe(1)
    const disposeBazStaticDefine = t.useStatic.proxy('____bar', '____baz')
    expect(t.____baz).toBe(1)

    disposeBarStaticDefine0()
    const disposeBarStaticDefine1 = t.useStatic('____bar', 2)
    expect(t.____baz).toBe(2)

    disposeBarStaticDefine1()
    expect(t.____bar).toBeUndefined()
    expect(t.____baz).toBeUndefined()
    disposeBazStaticDefine()
  })
  test('throw Error when nativeKey is not existed', () => {
    expect(() => {
      t.useStatic.proxy('____foo', '____bar')
    }).toThrow()
  })
  test('throw Error when proxyKey is existed', () => {
    expect(() => {
      t.useStatic.proxy('____bar', '____foo')
    }).toThrow()
  })
  test('can not refine static field "CANT_REFINE"', () => {
    expect(() => {
      // @ts-expect-error
      t.useStatic.proxy('____foo', 'CANT_REFINE')
    }).toThrow()
  })
  test('can not refine self', () => {
    expect(() => {
      // @ts-expect-error
      t.useStatic.proxy('____foo', '____foo')
    }).toThrow()
  })
  test('setter', () => {
    const dispose = t.use(ctx => {
      ctx.useStatic('____test_useStaticField0', '0')
      ctx.useStatic.proxy('____test_useStaticField0', '____test_useStaticField1')
    })
    expect(t.____test_useStaticField0).toBe('0')
    expect(t.____test_useStaticField1).toBe('0')
    t.____test_useStaticField1 = '1'
    expect(t.____test_useStaticField0).toBe('1')
    expect(t.____test_useStaticField1).toBe('1')
    dispose()
    expect(t).not.toHaveProperty('____test_useStaticField0')
    expect(t).not.toHaveProperty('____test_useStaticField1')
  })
  test('throw error when refine CantRefine fields', () => {
    expect(() => {
      t.useStatic.proxy(
        'useResolver',
        // @ts-expect-error
        'useStatic'
      )
    }).toThrow('You can\'t refine static field "useStatic" to "useResolver" for typp, because it is always static')
  })
  test('throw error when refine not existed fields', () => {
    expect(() => {
      t.useStatic.proxy(
        'useResolver',
        '____test_useStaticField0'
      )
      t.useStatic.proxy(
        'useResolver',
        '____test_useStaticField0'
      )
    }).toThrow('You can\'t refine static field "____test_useStaticField0" to "useResolver" for typp, because it is existed')
  })
})
