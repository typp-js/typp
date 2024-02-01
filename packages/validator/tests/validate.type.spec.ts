import type { t } from '@typp/core'
import { describe, expectTypeOf, test } from 'vitest'

describe('validate', () => {
  test('base', () => {
    expectTypeOf<t.Validate<number, 1, 1, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<string, string, string, { }>>().toEqualTypeOf<string>()
    expectTypeOf<t.Validate<string, 1, 1, { }>>().toEqualTypeOf<never>()
    expectTypeOf<t.Validate<string, never, never, { }>>().toEqualTypeOf<never>()
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
    expectTypeOf<t.Validate<number, 1, 1, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<number>>()
    expectTypeOf<t.Validate<string, string, string, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<string>>()
    expectTypeOf<t.Validate<string, 1, 1, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()

    // unknown or any
    expectTypeOf<t.Validate<number, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateResult<number>>()
    expectTypeOf<t.Validate<number, any, any, Opts>>().toEqualTypeOf<t.ValidateResult<number>>()

    expectTypeOf<t.Validate<unknown, any, any, Opts>>().toEqualTypeOf<t.ValidateResult<unknown>>()
    expectTypeOf<t.Validate<unknown, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<unknown>>()
    expectTypeOf<t.Validate<any, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateResult<any>>()
    expectTypeOf<t.Validate<any, any, any, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<any>>()

    // never
    expectTypeOf<t.Validate<string, never, never, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
    expectTypeOf<t.Validate<never, never, never, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<never>>()
    expectTypeOf<t.Validate<any, never, never, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
    expectTypeOf<t.Validate<unknown, never, never, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
  })
  test('const', () => {
    type Opts = { const: true }
    expectTypeOf<t.Validate<number, 1, 1, Opts>>().toEqualTypeOf<1>()
    expectTypeOf<t.Validate<string, string, string, Opts>>().toEqualTypeOf<string>()
    expectTypeOf<t.Validate<string, 1, 1, Opts>>().toEqualTypeOf<never>()

    expectTypeOf<t.Validate<number, 1 | unknown, unknown, Opts>>()
      // TODO maybe should be `1`, but typescript can't infer it
      .toEqualTypeOf<unknown>()
  })
  test('try and const', () => {
    type Opts = { try: true, const: true }
    expectTypeOf<t.Validate<number, 1, 1, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<1>>()
    expectTypeOf<t.Validate<string, string, string, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<string>>()
    expectTypeOf<t.Validate<string, 1, 1, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
  })
  test('transform', () => {
    type Opts = { transform: true }
    expectTypeOf<t.Validate<number, '1', '1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, '1.2', '1.2', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, '1px', '1px', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, '1.2px', '1.2px', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, true, true, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, false, false, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, boolean, boolean, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, null, null, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, undefined, undefined, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, bigint, bigint, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, 1n, 1n, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, string, string, Opts>>().toEqualTypeOf<number>()

    expectTypeOf<t.Validate<number, 'a', 'a', Opts>>().toEqualTypeOf<never>()
  })
  test('transform and const', () => {
    type Opts = { transform: true, const: true }
    expectTypeOf<t.Validate<number, '1', '1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, true, true, Opts>>().toEqualTypeOf<1>()
    expectTypeOf<t.Validate<number, false, false, Opts>>().toEqualTypeOf<0>()
    expectTypeOf<t.Validate<number, boolean, boolean, Opts>>().toEqualTypeOf<1 | 0>()
    expectTypeOf<t.Validate<number, null, null, Opts>>().toEqualTypeOf<0>()
    expectTypeOf<t.Validate<number, undefined, undefined, Opts>>().toEqualTypeOf<0>()
    expectTypeOf<t.Validate<number, bigint, bigint, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, 1n, 1n, Opts>>().toEqualTypeOf<number>()
  })
  test('special radix', () => {
    type Opts = { transform: true }
    expectTypeOf<t.Validate<number, '0b1', '0b1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, '0B1', '0B1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, '0o1', '0o1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, '0O1', '0O1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, '0x1', '0x1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.Validate<number, '0X1', '0X1', Opts>>().toEqualTypeOf<number>()
  })
  test('transform and try', () => {
    type Opts = { transform: true, try: true }
    expectTypeOf<t.Validate<number, '1', '1', Opts>>().toEqualTypeOf<t.ValidateSuccessResult<number>>()
    expectTypeOf<t.Validate<number, 'a1', 'a1', Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
    expectTypeOf<t.Validate<number, string, string, Opts>>().toEqualTypeOf<t.ValidateResult<number>>()
  })
})
