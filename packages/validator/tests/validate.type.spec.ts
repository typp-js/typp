import type { t } from '@typp/core'
import { describe, expectTypeOf, test } from 'vitest'

describe('validate', () => {
  test('base', () => {
    expectTypeOf<t.Validate<number, 1, 1, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<string, string, string, { }>>().toEqualTypeOf<string>()
    expectTypeOf<t.Validate<string, 1, 1, { }>>().toEqualTypeOf<never>()
  })
  test('try', () => {
    expectTypeOf<t.Validate<number, 1, 1, { try: true }>>().toEqualTypeOf<t.ValidateSuccess<number>>()
    expectTypeOf<t.Validate<string, string, string, { try: true }>>().toEqualTypeOf<t.ValidateSuccess<string>>()
    expectTypeOf<t.Validate<string, 1, 1, { try: true }>>().toEqualTypeOf<t.ValidateError>()
  })
})
