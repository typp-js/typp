import { t } from '@typp/core'
import validator from '@typp/validator'
import { ValidateError } from '@typp/validator/error'
import { beforeAll, describe, expect, expectTypeOf, test, vi } from 'vitest'

beforeAll(() => t.use(validator))

describe('validate', () => {
  test('base', () => {
    const NumberSchema = t.number()
    const r = NumberSchema.validate(1)
    expect(r).toBe(1)
    expectTypeOf(r).toEqualTypeOf<number>()
  })
  test('unexpected', () => {
    const NumberSchema = t.number()
    expect(() => {
      // @ts-expect-error
      NumberSchema.validate('a')
    }).toThrow(ValidateError)
    expect(() => {
      // @ts-expect-error
      NumberSchema.validate.narrow('a')
    }).toThrow(ValidateError)
  })
  test('narrow', () => {
    const NumberSchema = t.number()
    const r = NumberSchema.validate.narrow(1)
    expect(r).toBe(1)
    expectTypeOf(r).toEqualTypeOf<1>()
  })
  test('try', () => {
    const NumberSchema = t.number()
    const result0 = NumberSchema.tryValidate(1)
    expect(result0.success).toBe(true)
    expect(result0.data).toBe(1)
    expectTypeOf(result0).toEqualTypeOf<t.ValidateSuccessResult<number>>()

    const result1 = NumberSchema.tryValidate('a')
    expect(result1.success).toBe(false)
    expect(result1.error).toBeInstanceOf(ValidateError)
    expectTypeOf(result1).toEqualTypeOf<t.ValidateErrorResult>()

    const result2 = NumberSchema.tryValidate({} as any)
    expectTypeOf(result2).toEqualTypeOf<t.ValidateResult<number>>()
    if (result2.success) {
      expectTypeOf(result2).toEqualTypeOf<t.ValidateSuccessResult<number>>()
    } else {
      expectTypeOf(result2).toEqualTypeOf<t.ValidateErrorResult>()
      expect(result2.success).toBe(false)
      expect(result2.error).toBeInstanceOf(ValidateError)
    }

    const result3 = NumberSchema.tryValidate({} as unknown)
    expectTypeOf(result3).toEqualTypeOf<t.ValidateResult<number>>()
    if (result3.success) {
      expectTypeOf(result3).toEqualTypeOf<t.ValidateSuccessResult<number>>()
    } else {
      expectTypeOf(result3).toEqualTypeOf<t.ValidateErrorResult>()
      expect(result3.error).toBeInstanceOf(ValidateError)
    }
    expect(result2.success).toBe(false)
  })
  test('try and narrow', () => {
    const NumberSchema = t.number()
    const result0 = NumberSchema.tryValidate.narrow(1)
    expect(result0.success).toBe(true)
    expect(result0.data).toBe(1)
    expectTypeOf(result0).toEqualTypeOf<t.ValidateSuccessResult<1>>()
  })
  test('no transform input', () => {
    const NumberSchema = t.number()
    expect(() => {
      // @ts-expect-error
      NumberSchema.validate()
    }).toThrow('No data to validate')
    expect(() => {
      // @ts-expect-error
      NumberSchema.validate(undefined)
    }).toThrow(new ValidateError('unexpected', NumberSchema, 'undefined'))
  })
  describe('parse', () => {
    test('no transform input', () => {
      expect(() => {
        // @ts-expect-error
        t.number().parse()
      }).toThrow('No data to validate')
    })
  })
  describe('test', () => {
    test('base', () => {
      const NumberSchema = t.number()
      const num = 1 as string | number
      const isRight = vi.fn()
      if (NumberSchema.test(num)) {
        isRight()
        expectTypeOf(num).toEqualTypeOf<number>()
      } else {
        expectTypeOf(num).toEqualTypeOf<string>()
      }
      expect(isRight).toHaveBeenCalled()
      const isWrong = vi.fn()
      const str = 'a' as string | number
      if (NumberSchema.test(str)) {
        expectTypeOf(str).toEqualTypeOf<number>()
      } else {
        isWrong()
        expectTypeOf(str).toEqualTypeOf<string>()
      }
      expect(isWrong).toHaveBeenCalled()
    })
  })
})
