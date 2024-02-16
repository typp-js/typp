import { t } from '@typp/core'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

import { validatorSkeleton } from '../../src'
import { literalValidator } from '../../src/types/literal'

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
  })
})
