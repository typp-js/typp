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
    const r01 = undefinedSkm.validate(undefined)
    expect(r01).toBe(undefined)
    expectTypeOf(r01).toEqualTypeOf(undefined)
  })
  test('transform', () => {
  })
})
