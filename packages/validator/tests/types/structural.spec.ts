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
    const input0 = ['']
    const output = t0.validate(input0)
    expect(output).toEqual(input0)
    expectTypeOf(output).toEqualTypeOf<[string]>()
  })
})
