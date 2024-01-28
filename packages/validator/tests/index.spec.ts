import { t } from '@typp/core'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

import validator, { ValidateError } from '../src'

beforeAll(() => t.use(validator))

describe('parse', () => {
  test('base', () => {
    const NumberSchema = t.number()
    const a = NumberSchema.parse(1)
    expect(a).toBe(1)
    expectTypeOf(a).toEqualTypeOf<number>()
    const b = NumberSchema.parse.narrow(1)
    expect(b).toBe(1)
    expectTypeOf(b).toEqualTypeOf<1>()
  })
  test('unexpected', () => {
    const NumberSchema = t.number()
    // @ts-expect-error
    expect(() => NumberSchema.parse('1')).toThrow(ValidateError)
    // @ts-expect-error
    expect(() => NumberSchema.parse.narrow('1')).toThrow(ValidateError)
  })
  test('tryParse', () => {
    const NumberSchema = t.number()
    const result0 = NumberSchema.tryParse(1)
    expect(result0.success).toBe(true)
    expect(result0.data).toBe(1)
    expectTypeOf(result0).toEqualTypeOf<t.ParseSuccess<number>>()

    const result1 = NumberSchema.tryParse('1')
    expect(result1.success).toBe(false)
    expect(result1.error).toBeInstanceOf(ValidateError)
    expectTypeOf(result1).toEqualTypeOf<t.ParseError>()

    const result2 = NumberSchema.tryParse({} as any)
    expectTypeOf(result2).toEqualTypeOf<t.ParseResult<number>>()
    if (result2.success) {
      expectTypeOf(result2).toEqualTypeOf<t.ParseSuccess<number>>()
    } else {
      expectTypeOf(result2).toEqualTypeOf<t.ParseError>()
      expect(result2.success).toBe(false)
      expect(result2.error).toBeInstanceOf(ValidateError)
    }

    const result3 = NumberSchema.tryParse({} as unknown)
    expectTypeOf(result3).toEqualTypeOf<t.ParseResult<number>>()
    if (result3.success) {
      expectTypeOf(result3).toEqualTypeOf<t.ParseSuccess<number>>()
    } else {
      expectTypeOf(result3).toEqualTypeOf<t.ParseError>()
      expect(result3.error).toBeInstanceOf(ValidateError)
    }
    expect(result2.success).toBe(false)
  })
})
describe('primitive', () => {
  describe('number', () => {
    test('base', () => {
      const skm = t.number()
      const r0 = skm.parse(1)
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()
      expect(() => {
        // @ts-expect-error
        skm.parse('1')
      }).toThrow(new ValidateError('unexpected', skm, '1'))
    })
    test('NaN', () => {
      const skm = t.number()
      expect(() => {
        // @ts-expect-error
        skm.parse(NaN)
      }).toThrow(new ValidateError('unexpected', skm, NaN))
    })
  })
})
