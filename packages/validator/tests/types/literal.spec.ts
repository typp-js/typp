import { ValidateError } from '#internal'

import { t } from '@typp/core'
import { FALSY, validatorSkeleton } from '@typp/validator'
import { literalValidator } from '@typp/validator/types/literal'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

beforeAll(() => t.use(validatorSkeleton))

describe('null and undefined', () => {
  beforeAll(() => t.use(literalValidator))
  test('base', () => {
    const nullSkm = t.null()
    const r00 = nullSkm.validate(null)
    expect(r00).toBe(null)
    expectTypeOf(r00).toEqualTypeOf(null)

    const undefinedSkm = t.undefined()
    const r10 = undefinedSkm.validate(undefined)
    expect(r10).toBe(undefined)
    expectTypeOf(r10).toEqualTypeOf(undefined)
  })
  test('unexpected', () => {
    const nullSkm = t.null()
    expect(() => {
      // @ts-expect-error
      nullSkm.validate(undefined)
    }).toThrow()
    expect(() => {
      // @ts-expect-error
      nullSkm.validate('null')
    }).toThrow()
    expect(() => {
      // @ts-expect-error
      nullSkm.validate(0)
    }).toThrow()

    const undefinedSkm = t.undefined()
    expect(() => {
      // @ts-expect-error
      undefinedSkm.validate(null)
    }).toThrow()
    expect(() => {
      // @ts-expect-error
      undefinedSkm.validate('undefined')
    }).toThrow()
    expect(() => {
      // @ts-expect-error
      undefinedSkm.validate(0)
    }).toThrow()
  })
  test('transform', () => {
    const nullSkm = t.null()
    const undefinedSkm = t.undefined()

    for (const falsyConstant of FALSY) {
      const r00 = nullSkm.parse(falsyConstant)
      expect(r00).toBe(null)
      expectTypeOf(r00).toEqualTypeOf<null>()

      const r10 = undefinedSkm.parse(falsyConstant)
      expect(r10).toBe(undefined)
      expectTypeOf(r10).toEqualTypeOf<undefined>()
    }
    expectTypeOf(nullSkm.parse(null))
      .toEqualTypeOf<null>()
    expectTypeOf(nullSkm.parse(undefined))
      .toEqualTypeOf<null>()
    expectTypeOf(nullSkm.parse(0))
      .toEqualTypeOf<null>()

    expectTypeOf(nullSkm.parse(undefined as never))
      .toEqualTypeOf<never>()
    try {
      expectTypeOf(nullSkm.parse(1 as never))
        .toEqualTypeOf<never>()
    } catch (e) {
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).property('actual').equal(1)
      expect(e).property('expected').equal(nullSkm)
    }

    const r10 = undefinedSkm.parse(undefined)
    expectTypeOf(r10).toEqualTypeOf<undefined>()
  })
})
describe('literal primitive', () => {
  beforeAll(() => t.use(literalValidator))
  test('base', () => {
    const oneNumberSkm = t.const(1)

    const r0 = oneNumberSkm.validate(1)
    expect(r0).toBe(1)
    expectTypeOf(r0).toEqualTypeOf<1>()
  })
  test('unexpected', () => {
    const oneNumberSkm = t.const(1)
    expect(() => {
      // @ts-expect-error - TS2345: Argument of type 2 is not assignable to parameter of type 1
      oneNumberSkm.validate(2)
    }).toThrow()
    expect(() => {
      // @ts-expect-error - TS2345: Argument of type null is not assignable to parameter of type 1
      oneNumberSkm.validate(null)
    }).toThrow()
    expect(() => {
      // @ts-expect-error - TS2345: Argument of type undefined is not assignable to parameter of type 1
      oneNumberSkm.validate(undefined)
    }).toThrow()
    expect(() => {
      oneNumberSkm.validate({} as 1)
    }).toThrow()
    expect(() => {
      oneNumberSkm.validate({} as any)
    }).toThrow()
    expect(() => {
      // unknown ⊃ number ⊃ 1
      // @ts-expect-error - TS2345: Argument of type unknown is not assignable to parameter of type 1
      oneNumberSkm.validate({} as unknown)
    }).toThrow()
    expect(() => {
      // number ⊃ 1 ⊃ never
      oneNumberSkm.validate({} as never)
    }).toThrow()

    const zeroNumberSkm = t.const(0)
    expect(() => {
      // @ts-expect-error - TS2345: Argument of type 1 is not assignable to parameter of type 0
      zeroNumberSkm.validate(1)
    }).toThrow()
    expect(() => {
      // @ts-expect-error - TS2345: Argument of type null is not assignable to parameter of type 0
      zeroNumberSkm.validate(null)
    }).toThrow()
    expect(() => {
      // @ts-expect-error - TS2345: Argument of type undefined is not assignable to parameter of type 0
      zeroNumberSkm.validate(undefined)
    }).toThrow()
  })
  describe('types', () => {
    test('bigint', () => {
      const zeroBigIntSkm = t.const(0n)
      const r0 = zeroBigIntSkm.validate(0n)
      expect(r0).toBe(0n)
      expectTypeOf(r0).toEqualTypeOf<0n>()

      expect(() => {
        // @ts-expect-error - TS2345: Argument of type 1n is not assignable to parameter of type 0n
        zeroBigIntSkm.validate(1n)
      }).toThrow()
    })
    test('boolean', () => {
      const trueBooleanSkm = t.const(true)
      const r0 = trueBooleanSkm.validate(true)
      expect(r0).toBe(true)
      expectTypeOf(r0).toEqualTypeOf<true>()

      const falseBooleanSkm = t.const(false)
      const r1 = falseBooleanSkm.validate(false)
      expect(r1).toBe(false)
      expectTypeOf(r1).toEqualTypeOf<false>()

      expect(() => {
        // @ts-expect-error - TS2345: Argument of type false is not assignable to parameter of type true
        trueBooleanSkm.validate(false)
      }).toThrow()
    })
    test('string', () => {
      const emptyStringSkm = t.const('')
      const r0 = emptyStringSkm.validate('')
      expect(r0).toBe('')
      expectTypeOf(r0).toEqualTypeOf<''>()

      const helloStringSkm = t.const('hello')
      const r1 = helloStringSkm.validate('hello')
      expect(r1).toBe('hello')
      expectTypeOf(r1).toEqualTypeOf<'hello'>()

      expect(() => {
        // @ts-expect-error - TS2345: Argument of type 'world' is not assignable to parameter of type 'hello'
        helloStringSkm.validate('world')
      }).toThrow()
    })
    test('symbol', () => {
      // eslint-disable-next-line symbol-description
      const sym = Symbol()
      const symbolSkm = t.const(sym)
      const r0 = symbolSkm.validate(sym)
      expect(r0).toBe(sym)
      expectTypeOf(r0).toEqualTypeOf<symbol>()

      expect(() => {
        // @ts-expect-error - TS2345: Argument of type symbol is not assignable to parameter of type unique symbol
        // eslint-disable-next-line symbol-description
        symbolSkm.validate(Symbol())
      }).toThrow()
    })
  })
  describe('transform', () => {
    test('bigint', () => {
      const zeroBigIntSkm = t.const(0n)
      const r0 = zeroBigIntSkm.parse(0n)
      expect(r0).toBe(0n)
      expectTypeOf(r0).toEqualTypeOf<0n>()

      const r1 = zeroBigIntSkm.parse(0)
      expect(r1).toBe(0n)
      expectTypeOf(r1).toEqualTypeOf<0n>()

      const r2 = zeroBigIntSkm.parse('0')
      expect(r2).toBe(0n)
      expectTypeOf(r2).toEqualTypeOf<0n>()
      expect(() => {
        const r0 = zeroBigIntSkm.parse(1)
        expectTypeOf(r0).toEqualTypeOf<never>()
      }).toThrow()
      expect(() => {
        const r0 = zeroBigIntSkm.parse('1')
        expectTypeOf(r0).toEqualTypeOf<never>()
      }).toThrow()
    })
    test('boolean', () => {
      const trueBooleanSkm = t.const(true)
      const r0 = trueBooleanSkm.parse(true)
      expect(r0).toBe(true)
      expectTypeOf(r0).toEqualTypeOf<true>()

      const r1 = trueBooleanSkm.parse(1)
      expect(r1).toBe(true)
      expectTypeOf(r1).toEqualTypeOf<true>()

      const r2 = trueBooleanSkm.parse('1')
      expect(r2).toBe(true)
      expectTypeOf(r2).toEqualTypeOf<true>()
      expect(() => {
        const r0 = trueBooleanSkm.parse(false)
        expectTypeOf(r0).toEqualTypeOf<never>()
      }).toThrow()
      expect(() => {
        const r0 = trueBooleanSkm.parse('false')
        expectTypeOf(r0).toEqualTypeOf<never>()
      }).toThrow()
    })
    test('string', () => {
      const emptyStringSkm = t.const('0')
      const r0 = emptyStringSkm.parse('0')
      expect(r0).toBe('0')
      expectTypeOf(r0).toEqualTypeOf<'0'>()

      const r1 = emptyStringSkm.parse(0)
      expect(r1).toBe('0')
      expectTypeOf(r1).toEqualTypeOf<'0'>()

      const r2 = t.const('false').parse(false)
      expect(r2).toBe('false')
      expectTypeOf(r2).toEqualTypeOf<'false'>()

      const r3 = t.const('true').parse(true)
      expect(r3).toBe('true')
      expectTypeOf(r3).toEqualTypeOf<'true'>()

      expect(() => {
        const r0 = emptyStringSkm.parse('1')
        expectTypeOf(r0).toEqualTypeOf<never>()
      }).toThrow()
    })
  })
})
