import type { t } from '@typp/core'
import { describe, expectTypeOf, test } from 'vitest'

describe('validate', () => {
  test('base', () => {
    expectTypeOf<t.Validate<number, 1, 1, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<string, string, string, { }>>().toEqualTypeOf<string>()
    expectTypeOf<t.Validate<string, 1, 1, { }>>().toEqualTypeOf<never>()
  })
  test('try', () => {
    type Opts = { try: true }
    expectTypeOf<t.Validate<number, 1, 1, Opts>>().toEqualTypeOf<t.ValidateSuccess<number>>()
    expectTypeOf<t.Validate<string, string, string, Opts>>().toEqualTypeOf<t.ValidateSuccess<string>>()
    expectTypeOf<t.Validate<string, 1, 1, Opts>>().toEqualTypeOf<t.ValidateError>()
  })
  test('const', () => {
    type Opts = { const: true }
    expectTypeOf<t.Validate<number, 1, 1, Opts>>().toEqualTypeOf<1>()
    expectTypeOf<t.Validate<string, string, string, Opts>>().toEqualTypeOf<string>()
    expectTypeOf<t.Validate<string, 1, 1, Opts>>().toEqualTypeOf<never>()
  })
  test('try and const', () => {
    type Opts = { try: true, const: true }
    expectTypeOf<t.Validate<number, 1, 1, Opts>>().toEqualTypeOf<t.ValidateSuccess<1>>()
    expectTypeOf<t.Validate<string, string, string, Opts>>().toEqualTypeOf<t.ValidateSuccess<string>>()
    expectTypeOf<t.Validate<string, 1, 1, Opts>>().toEqualTypeOf<t.ValidateError>()
  })
})
