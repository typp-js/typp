import { t } from '@typp/core'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

import { isWhatError, validatorSkeleton } from '../../src'
import { ValidateError } from '../../src/base.inner'
import { stringValidator } from '../../src/types/primitive.string'
import { arrayValidator } from '../../src/types/structural'

beforeAll(() => t.use(validatorSkeleton))

describe('array', () => {
  beforeAll(() => t.use(ctx => {
    ctx.use(arrayValidator)
    ctx.use(stringValidator)
  }))
  test('base', () => {
    const t0 = t(Array, String)

    const output0 = t0.validate([''])
    expect(output0).toEqual([''])
    expectTypeOf(output0).toEqualTypeOf<string[]>()

    const output1 = t0.validate(['', ''])
    expect(output1).toEqual(['', ''])
    expectTypeOf(output1).toEqualTypeOf<string[]>()

    expect(() => {
      // @ts-expect-error - TS2322: Type number is not assignable to type string
      t0.validate([1])
    }).toThrow('Data is unexpected')
  })
})
describe('tuple', () => {
  beforeAll(() => t.use(ctx => {
    ctx.use(arrayValidator)
    ctx.use(stringValidator)
  }))
  test('base', () => {
    const t0 = t([String])
    const output = t0.validate([''])
    expect(output).toEqual([''])
    expectTypeOf(output).toEqualTypeOf<[string]>()

    expect(() => {
      // @ts-expect-error - TS2322: Type number is not assignable to type string
      t0.validate([1])
    }).toThrow('Data is unexpected')
  })
  test('length is not match', () => {
    const t0 = t([String])
    try {
      // @ts-expect-error - TS2345: Argument of type [string, number] is not assignable to parameter of type [string]
      // Source has 2 element(s) but target allows only 1
      t0.validate(['', 1])
    } catch (e) {
      expect(e).toBeInstanceOf(ValidateError)
      expect(e).toHaveProperty('message', 'Data is partially match')
      if (isWhatError(e, 'ValidateError:tuple length not match')) {
        expect(e.args).toEqual([1, 2])
        expectTypeOf(e.args).toEqualTypeOf<[number, number]>()
      } else {
        throw new Error('The error should be ValidateError:tuple length not match')
      }
    }
  })
})
