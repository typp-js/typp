import { t } from '@typp/core'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

import { FALSY, validatorSkeleton } from '../../src'
import { ValidateError } from '../../src/base.inner'
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
  })
})
