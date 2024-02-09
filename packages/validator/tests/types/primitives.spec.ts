import { t } from '@typp/core'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

import { validatorSkeleton } from '../../src'
import { ValidateError } from '../../src/base.inner'
import { numberValidator } from '../../src/types/primitive.number'

beforeAll(() => t.use(validatorSkeleton))

describe('bigint', () => {
})
describe('boolean', () => {
})
describe('number', () => {
  beforeAll(() => t.use(numberValidator))
  test('base', () => {
    const r0 = t.number().validate(1)
    expect(r0).toBe(1)
    expectTypeOf(r0).toEqualTypeOf<number>()
  })
  test('instanceof', () => {
    // noinspection JSPrimitiveTypeWrapperUsage
    const r0 = t.number().validate(new Number(1))
    expect(r0).toBe(1)
    expectTypeOf(r0).toEqualTypeOf<number>()
    const r1 = t.number().validate(Number(1))
    expect(r1).toBe(1)
    expectTypeOf(r1).toEqualTypeOf<number>()
    const r2 = t.number().validate(Object(1))
    expect(r2).toBe(1)
    expectTypeOf(r2).toEqualTypeOf<number>()
    const r3 = t.number().validate(Object(Number(1)))
    expect(r3).toBe(1)
    expectTypeOf(r3).toEqualTypeOf<number>()

    const r4 = t.number().validate(new class extends Number {
      constructor() {
        super(1)
      }
    }())
    expect(r4).toBe(1)
    expectTypeOf(r4).toEqualTypeOf<number>()

    const r5 = t.number().validate(new class extends Number {
      constructor() { super(1) }
      valueOf() { return 2 }
    }())
    expect(r5).toBe(2)
    expectTypeOf(r5).toEqualTypeOf<number>()

    const r6 = t.number().validate(new class extends Number {
      constructor() { super(1) }
      [Symbol.toPrimitive]() { return 3 }
    }())
    expect(r6).toBe(3)
    expectTypeOf(r6).toEqualTypeOf<number>()

    const r7 = t.number().validate(new class extends Number {
      constructor() { super(1) }
      valueOf() { return 2 }
      [Symbol.toPrimitive]() { return 3 }
    }())
    expect(r7).toBe(3)
    expectTypeOf(r7).toEqualTypeOf<number>()

    const numberLike = {
      valueOf: () => 1,
      __proto__: Number.prototype
    } as unknown as Number
    const r8 = t.number().validate(numberLike)
    expect(r8).toBe(1)
    expectTypeOf(r8).toEqualTypeOf<number>()
  })
  test('NaN', () => {
    const r = t.number().validate(NaN)
    expect(r).toBeNaN()
    expectTypeOf(r).toEqualTypeOf<number>()
  })
  test('Infinity', () => {
    const r0 = t.number().validate(Infinity)
    expect(r0).toBe(Infinity)
    expectTypeOf(r0).toEqualTypeOf<number>()
    const r1 = t.number().validate(-Infinity)
    expect(r1).toBe(-Infinity)
    expectTypeOf(r1).toEqualTypeOf<number>()
  })
  test('unexpected', () => {
    const skm = t.number()
    expect(() => {
      // @ts-expect-error
      skm.validate('abc')
    }).toThrow(new ValidateError('unexpected', skm, '1'))
  })
  describe('parse', () => {
    test('transform - string', () => {
      const skm = t.number()
      const r0 = skm.parse('1')
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()

      // special number
      const r1 = skm.parse('NaN')
      expect(r1).toBeNaN()
      expectTypeOf(r1).toEqualTypeOf<number>()
      const r2 = skm.parse('Infinity')
      expect(r2).toBe(Infinity)
      expectTypeOf(r2).toEqualTypeOf<number>()
      const r3 = skm.parse('-Infinity')
      expect(r3).toBe(-Infinity)
      expectTypeOf(r3).toEqualTypeOf<number>()

      // special radix
      const r4 = skm.parse('0b10')
      const r5 = skm.parse('0B10')
      expect(r4).toBe(2)
      expect(r4).toBe(r5)
      expectTypeOf(r4).toEqualTypeOf<number>()
      expectTypeOf(r4).toEqualTypeOf<typeof r5>()
      const r6 = skm.parse('0o10')
      const r7 = skm.parse('0O10')
      expect(r6).toBe(8)
      expect(r6).toBe(r7)
      expectTypeOf(r6).toEqualTypeOf<number>()
      expectTypeOf(r6).toEqualTypeOf<typeof r7>()
      const r8 = skm.parse('0x1b')
      const r9 = skm.parse('0X1b')
      expect(r8).toBe(27)
      expect(r8).toBe(r9)
      expectTypeOf(r8).toEqualTypeOf<number>()
      expectTypeOf(r8).toEqualTypeOf<typeof r9>()

      // float
      const r10 = skm.parse('1.2')
      expect(r10).toBe(1.2)
      expectTypeOf(r10).toEqualTypeOf<number>()
      const r11 = skm.parse('1.2e3')
      expect(r11).toBe(1200)
      expectTypeOf(r11).toEqualTypeOf<number>()
      const r12 = skm.parse('1.2e-3')
      expect(r12).toBe(0.0012)
      expectTypeOf(r12).toEqualTypeOf<number>()
      const r13 = skm.parse('1.2e+3')
      expect(r13).toBe(1200)
      expectTypeOf(r13).toEqualTypeOf<number>()

      // negative
      const r14 = skm.parse('-1.2')
      expect(r14).toBe(-1.2)
      expectTypeOf(r14).toEqualTypeOf<number>()

      // empty
      const r15 = skm.parse('')
      expect(r15).toBe(0)
      expectTypeOf(r15).toEqualTypeOf<number>()

      // with suffix
      const r16 = skm.parse('1px')
      expect(r16).toBe(1)
      expectTypeOf(r16).toEqualTypeOf<number>()
      const r17 = skm.parse('1.2px')
      expect(r17).toBe(1.2)
      expectTypeOf(r17).toEqualTypeOf<number>()
      const r18 = skm.parse('1.2e3px')
      expect(r18).toBe(1200)
      expectTypeOf(r18).toEqualTypeOf<number>()

      expect(() => {
        expectTypeOf(skm.parse('abc')).toEqualTypeOf<number>()
      }).toThrow(new ValidateError('unexpected', skm, 'abc'))
    })
    test('transform - boolean', () => {
      const skm = t.number()
      const r0 = skm.parse(true)
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()
      const r1 = skm.parse(false)
      expect(r1).toBe(0)
      expectTypeOf(r1).toEqualTypeOf<number>()

      // with const
      const r2 = skm.parse.narrow(true)
      expect(r2).toBe(1)
      expectTypeOf(r2).toEqualTypeOf<1>()
    })
    test('transform - null', () => {
      const skm = t.number()
      const r0 = skm.parse(null)
      expect(r0).toBe(0)
      expectTypeOf(r0).toEqualTypeOf<number>()

      // with const
      const r1 = skm.parse.narrow(null)
      expect(r1).toBe(0)
      expectTypeOf(r1).toEqualTypeOf<0>()
    })
    test('transform - undefined', () => {
      const skm = t.number()
      const r0 = skm.parse(undefined)
      expect(r0).toBe(0)
      expectTypeOf(r0).toEqualTypeOf<number>()

      // with const
      const r1 = skm.parse.narrow(undefined)
      expect(r1).toBe(0)
      expectTypeOf(r1).toEqualTypeOf<0>()
    })
    test('transform - bigint', () => {
      const skm = t.number()
      const r0 = skm.parse(1n)
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()

      // with const
      const r1 = skm.parse.narrow(1n)
      expect(r1).toBe(1)
      expectTypeOf(r1).toEqualTypeOf<number>()
      // overflow number
      const r2 = skm.parse.narrow(BigInt(Number.MAX_SAFE_INTEGER) + 1n)
      expect(r2).toBe(Infinity)
      expectTypeOf(r2).toEqualTypeOf<number>()
      const r3 = skm.parse.narrow(-(BigInt(Number.MAX_SAFE_INTEGER) + 1n))
      expectTypeOf(r3).toEqualTypeOf<number>()
    })
    test('transform - any or unknown', () => {
      expectTypeOf(
        t.number().parse(1 as any)
      ).toEqualTypeOf<number>()
      expectTypeOf(
        t.number().parse(1 as unknown)
      ).toEqualTypeOf<never>()
    })
    test('try and transform - any or unknown', () => {
      expectTypeOf(
        t.number().tryParse(1 as any)
      ).toEqualTypeOf<t.ValidateResult<number>>()
      expectTypeOf(
        t.number().tryParse(1 as unknown)
      ).toEqualTypeOf<t.ValidateErrorResult>()
    })
    test('transform - valueOf', () => {
      const skm = t.number()
      const r0 = skm.parse({ valueOf: () => 1 } as Number)
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()
    })
  })
})
describe('string', () => {
})
describe('symbol', () => {
})
