import { t } from '@typp/core'
import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

import { validatorSkeleton } from '../../src'
import { stringValidator } from '../../src/types/primitive.string'
import { arrayValidator } from '../../src/types/structural'

beforeAll(() => t.use(validatorSkeleton))

describe('array', () => {
  beforeAll(() => t.use(arrayValidator))
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
})
