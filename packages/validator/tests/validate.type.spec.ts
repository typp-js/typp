import type { t } from '@typp/core'
import { describe, expectTypeOf, test } from 'vitest'

describe('validate', () => {
  test('base', () => {
    expectTypeOf<t.Validate<number, 1, 1, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<string, string, string, { }>>().toEqualTypeOf<string>()
    expectTypeOf<t.Validate<string, 1, 1, { }>>().toEqualTypeOf<never>()
  })
  test('unknown or any', () => {
    expectTypeOf<t.Validate<number, unknown, unknown, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, any, any, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<unknown, unknown, unknown, { }>>().toEqualTypeOf<unknown>()
    expectTypeOf<t.Validate<any, unknown, unknown, { }>>().toEqualTypeOf<any>()
    expectTypeOf<t.Validate<never, unknown, unknown, { }>>().toEqualTypeOf<never>()
    expectTypeOf<t.Validate<never, any, any, { }>>().toEqualTypeOf<never>()

    expectTypeOf<t.Validate<number, 1 | unknown, 1 | unknown, { }>>().toEqualTypeOf<number>()
  })
  test('try', () => {
    type Opts = { try: true }
    expectTypeOf<t.Validate<number, 1, 1, Opts>>().toEqualTypeOf<t.ValidateSuccess<number>>()
    expectTypeOf<t.Validate<string, string, string, Opts>>().toEqualTypeOf<t.ValidateSuccess<string>>()
    expectTypeOf<t.Validate<string, 1, 1, Opts>>().toEqualTypeOf<t.ValidateError>()

    // unknown or any
    expectTypeOf<t.Validate<number, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateResult<number>>()
    expectTypeOf<t.Validate<number, any, any, Opts>>().toEqualTypeOf<t.ValidateResult<number>>()

    expectTypeOf<t.Validate<unknown, any, any, Opts>>().toEqualTypeOf<t.ValidateResult<unknown>>()
    expectTypeOf<t.Validate<unknown, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateSuccess<unknown>>()
    expectTypeOf<t.Validate<any, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateResult<any>>()
    expectTypeOf<t.Validate<any, any, any, Opts>>().toEqualTypeOf<t.ValidateSuccess<any>>()
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
