import { t } from '@typp/core'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

import { FALSY, validatorSkeleton } from '../../src'
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
    const nullSkm = t.null()
    const undefinedSkm = t.undefined()

    for (const falsyConstant of FALSY) {
      const r00 = nullSkm.parse(falsyConstant)
      expect(r00).toBe(null)
      expectTypeOf(r00).toEqualTypeOf(null)

      const r10 = undefinedSkm.parse(falsyConstant)
      expect(r10).toBe(undefined)
      expectTypeOf(r10).toEqualTypeOf(undefined)
    }
    const r00 = nullSkm.parse(null)
    expectTypeOf(r00).toEqualTypeOf<null>()
    const r01 = nullSkm.parse(undefined)
    expectTypeOf(r01).toEqualTypeOf<null>()
    const r02 = nullSkm.parse(0)
    expectTypeOf(r02).toEqualTypeOf<null>()
    const r03 = nullSkm.parse(undefined as never)
    expectTypeOf(r03).toEqualTypeOf<never>()

    const r10 = undefinedSkm.parse(undefined)
    expectTypeOf(r10).toEqualTypeOf<undefined>()
  })
})
