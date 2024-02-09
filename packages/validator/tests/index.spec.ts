import { t } from '@typp/core'
import { beforeAll, describe, expect, expectTypeOf, test, vi } from 'vitest'

import validator from '../src'
import { FALSELY } from '../src/base'
import { ValidateError } from '../src/base.inner'

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
  describe('primitive', () => {
    describe('string', () => {
      test('base', () => {
        const r0 = t.string().validate('1')
        expect(r0).toBe('1')
        expectTypeOf(r0).toEqualTypeOf<string>()
      })
      test('unexpected', () => {
        const skm = t.string()
        expect(() => {
          // @ts-expect-error
          skm.validate(1)
        }).toThrow(new ValidateError('unexpected', skm, 1))
      })
      test('transform - number, boolean, null, undefined, bigint', () => {
        const skm = t.string()
        const r0 = skm.parse(1)
        expect(r0).toBe('1')
        expectTypeOf(r0).toEqualTypeOf<string>()
        const r1 = skm.parse(true)
        expect(r1).toBe('true')
        expectTypeOf(r1).toEqualTypeOf<string>()
        const r2 = skm.parse(false)
        expect(r2).toBe('false')
        expectTypeOf(r2).toEqualTypeOf<string>()
        const r3 = skm.parse(null)
        expect(r3).toBe('null')
        expectTypeOf(r3).toEqualTypeOf<string>()
        const r4 = skm.parse(undefined)
        expect(r4).toBe('undefined')
        expectTypeOf(r4).toEqualTypeOf<string>()
        const r5 = skm.parse(1n)
        expect(r5).toBe('1')
        expectTypeOf(r5).toEqualTypeOf<string>()
      })
      test('transform - any or unknown', () => {
        expectTypeOf(
          t.string().parse(1 as any)
        ).toEqualTypeOf<string>()
        expectTypeOf(
          t.string().parse(1 as unknown)
        ).toEqualTypeOf<string>()
      })
      test('try and transform - any or unknown', () => {
        expectTypeOf(
          t.string().tryParse(1 as any)
        ).toEqualTypeOf<t.ValidateSuccessResult<string>>()
        expectTypeOf(
          t.string().tryParse(1 as unknown)
        ).toEqualTypeOf<t.ValidateSuccessResult<string>>()
      })
      test('transform - toString', () => {
        const skm = t.string()
        const r0 = skm.parse({ toString: () => '1' })
        expect(r0).toBe('1')
        expectTypeOf(r0).toEqualTypeOf<string>()
      })
    })
    describe('boolean', () => {
      test('base', () => {
        const r0 = t.boolean().validate(true)
        expect(r0).toBe(true)
        expectTypeOf(r0).toEqualTypeOf<boolean>()
      })
      test('unexpected', () => {
        const skm = t.boolean()
        expect(() => {
          // @ts-expect-error
          skm.validate(1)
        }).toThrow(new ValidateError('unexpected', skm, 1))
      })
      test('transform - number, string, null, undefined, bigint', () => {
        const skm = t.boolean()
        const r0 = skm.parse(1)
        expect(r0).toBe(true)
        expectTypeOf(r0).toEqualTypeOf<boolean>()
        const r1 = skm.parse('true')
        expect(r1).toBe(true)
        expectTypeOf(r1).toEqualTypeOf<boolean>()
        const r2 = skm.parse('false')
        expect(r2).toBe(false)
        expectTypeOf(r2).toEqualTypeOf<boolean>()
        const r3 = skm.parse(null)
        expect(r3).toBe(false)
        expectTypeOf(r3).toEqualTypeOf<boolean>()
        const r4 = skm.parse(undefined)
        expect(r4).toBe(false)
        expectTypeOf(r4).toEqualTypeOf<boolean>()
        const r5 = skm.parse(1n)
        expect(r5).toBe(true)
        expectTypeOf(r5).toEqualTypeOf<boolean>()
      })
      test('transform - any or unknown', () => {
        expectTypeOf(
          t.boolean().parse(1 as any)
        ).toEqualTypeOf<boolean>()
        expectTypeOf(
          t.boolean().parse(1 as unknown)
        ).toEqualTypeOf<boolean>()
      })
      test('try and transform - any or unknown', () => {
        expectTypeOf(
          t.boolean().tryParse(1 as any)
        ).toEqualTypeOf<t.ValidateSuccessResult<boolean>>()
        expectTypeOf(
          t.boolean().tryParse(1 as unknown)
        ).toEqualTypeOf<t.ValidateSuccessResult<boolean>>()
      })
      test('transform - special falsy', () => {
        const skm = t.boolean()
        const r0 = skm.parse(0)
        expect(r0).toBe(false)
        expectTypeOf(r0).toEqualTypeOf<boolean>()
        const r1 = skm.parse('')
        expect(r1).toBe(false)
        expectTypeOf(r1).toEqualTypeOf<boolean>()
        FALSELY.forEach((falsyValue) => {
          const r = skm.parse(falsyValue)
          expect(r).toBe(false)
        })
      })
      test('transform - valueOf', () => {
        const skm = t.boolean()
        const r0 = skm.parse({ valueOf: () => true } as Boolean)
        expect(r0).toBe(true)
        expectTypeOf(r0).toEqualTypeOf<boolean>()
      })
    })
  })
})
