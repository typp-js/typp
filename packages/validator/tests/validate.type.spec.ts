import type { t } from '@typp/core'
import { describe, expectTypeOf, test } from 'vitest'

describe('validate', () => {
  test('base', () => {
    expectTypeOf<t.ValidateReturnType<number, number, 1, 1, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<string, string, string, string, { }>>().toEqualTypeOf<string>()
    expectTypeOf<t.ValidateReturnType<string, string, 1, 1, { }>>().toEqualTypeOf<never>()
    expectTypeOf<t.ValidateReturnType<string, string, never, never, { }>>().toEqualTypeOf<never>()
  })
  test('unknown or any', () => {
    expectTypeOf<t.ValidateReturnType<number, number, unknown, unknown, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, any, any, { }>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<unknown, unknown, unknown, unknown, { }>>().toEqualTypeOf<unknown>()
    expectTypeOf<t.ValidateReturnType<any, any, unknown, unknown, { }>>().toEqualTypeOf<any>()
    expectTypeOf<t.ValidateReturnType<never, never, unknown, unknown, { }>>().toEqualTypeOf<never>()
    expectTypeOf<t.ValidateReturnType<never, never, any, any, { }>>().toEqualTypeOf<never>()

    expectTypeOf<t.ValidateReturnType<number, number, 1 | unknown, 1 | unknown, { }>>().toEqualTypeOf<number>()
  })
  test('try', () => {
    type Opts = { try: true }
    expectTypeOf<t.ValidateReturnType<number, number, 1, never, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<number>>()
    expectTypeOf<t.ValidateReturnType<number, number, number, never, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<number>>()
    expectTypeOf<t.ValidateReturnType<
      number,
      number | Number,
      number | Number | string,
      string,
      Opts
    >>().toEqualTypeOf<t.ValidateErrorResult>()
    expectTypeOf<t.ValidateReturnType<string, string, string, never, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<string>>()
    expectTypeOf<t.ValidateReturnType<string, string, 1, 1, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()

    // unknown or any
    expectTypeOf<t.ValidateReturnType<number, number, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateResult<number>>()
    expectTypeOf<t.ValidateReturnType<number, number, any, any, Opts>>().toEqualTypeOf<t.ValidateResult<number>>()

    expectTypeOf<t.ValidateReturnType<unknown, unknown, any, any, Opts>>().toEqualTypeOf<t.ValidateResult<unknown>>()
    expectTypeOf<t.ValidateReturnType<unknown, unknown, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<unknown>>()
    expectTypeOf<t.ValidateReturnType<any, any, unknown, unknown, Opts>>().toEqualTypeOf<t.ValidateResult<any>>()
    expectTypeOf<t.ValidateReturnType<any, any, any, any, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<any>>()

    // never
    expectTypeOf<t.ValidateReturnType<string, string, never, never, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
    expectTypeOf<t.ValidateReturnType<never, never, never, never, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<never>>()
    expectTypeOf<t.ValidateReturnType<any, any, never, never, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
    expectTypeOf<t.ValidateReturnType<unknown, unknown, never, never, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
  })
  test('const', () => {
    type Opts = { const: true }
    expectTypeOf<t.ValidateReturnType<number, number, 1, never, Opts>>().toEqualTypeOf<1>()
    expectTypeOf<t.ValidateReturnType<string, string, string, never, Opts>>().toEqualTypeOf<string>()
    expectTypeOf<t.ValidateReturnType<string, string, 1, 1, Opts>>().toEqualTypeOf<never>()

    expectTypeOf<t.ValidateReturnType<number, number, 1 | unknown, unknown, Opts>>()
      // TODO maybe should be `1`, but typescript can't infer it
      .toEqualTypeOf<unknown>()
  })
  test('try and const', () => {
    type Opts = { try: true, const: true }
    expectTypeOf<t.ValidateReturnType<number, number, 1, never, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<1>>()
    expectTypeOf<t.ValidateReturnType<string, string, string, never, Opts>>().toEqualTypeOf<t.ValidateSuccessResult<string>>()
    expectTypeOf<t.ValidateReturnType<string, string, 1, never, Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
  })
  test('transform', () => {
    type Opts = { transform: true }
    expectTypeOf<t.ValidateReturnType<number, number, 1, never, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, Number, never, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '1', '1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '1.2', '1.2', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '1px', '1px', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '1.2px', '1.2px', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, true, true, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, false, false, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, boolean, boolean, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, null, null, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, undefined, undefined, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, bigint, bigint, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, 1n, 1n, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, number | string, string, Opts>>().toEqualTypeOf<number>()

    expectTypeOf<t.ValidateReturnType<number, number, 'a', 'a', Opts>>().toEqualTypeOf<never>()

    expectTypeOf<t.ValidateReturnType<number, number, any, never, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, unknown, never, Opts>>().toEqualTypeOf<number>()

    expectTypeOf<t.ValidateReturnType<number, number, never, never, Opts>>().toEqualTypeOf<never>()
  })
  test('transform with special `ExtendsT`', () => {
    type Opts = { transform: true }
    expectTypeOf<t.ValidateReturnType<number, number | Number, 1, never, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, '1', '1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, '1.2', '1.2', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, '1px', '1px', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, '1.2px', '1.2px', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, true, true, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, false, false, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, boolean, boolean, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, null, null, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, undefined, undefined, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, bigint, bigint, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, 1n, 1n, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number | Number, number | string, string, Opts>>().toEqualTypeOf<number>()

    expectTypeOf<t.ValidateReturnType<number, number | Number, 'a', 'a', Opts>>().toEqualTypeOf<never>()
  })
  test('transform and const', () => {
    type Opts = { transform: true, const: true }
    expectTypeOf<t.ValidateReturnType<number, number, 1, never, Opts>>().toEqualTypeOf<1>()
    expectTypeOf<t.ValidateReturnType<number, number, '1', '1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, true, true, Opts>>().toEqualTypeOf<1>()
    expectTypeOf<t.ValidateReturnType<number, number, number | Number | true, true, Opts>>().toEqualTypeOf<1>()
    expectTypeOf<t.ValidateReturnType<number, number, false, false, Opts>>().toEqualTypeOf<0>()
    expectTypeOf<t.ValidateReturnType<number, number, boolean, boolean, Opts>>().toEqualTypeOf<1 | 0>()
    expectTypeOf<t.ValidateReturnType<number, number, null, null, Opts>>().toEqualTypeOf<0>()
    expectTypeOf<t.ValidateReturnType<number, number, undefined, undefined, Opts>>().toEqualTypeOf<0>()
    expectTypeOf<t.ValidateReturnType<number, number, bigint, bigint, Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, 1n, 1n, Opts>>().toEqualTypeOf<number>()
  })
  test('special radix', () => {
    type Opts = { transform: true }
    expectTypeOf<t.ValidateReturnType<number, number, '0b1', '0b1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '0B1', '0B1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '0o1', '0o1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '0O1', '0O1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '0x1', '0x1', Opts>>().toEqualTypeOf<number>()
    expectTypeOf<t.ValidateReturnType<number, number, '0X1', '0X1', Opts>>().toEqualTypeOf<number>()
  })
  test('transform and try', () => {
    type Opts = { transform: true, try: true }
    expectTypeOf<t.ValidateReturnType<number, number, '1', '1', Opts>>().toEqualTypeOf<t.ValidateSuccessResult<number>>()
    expectTypeOf<t.ValidateReturnType<number, number, 'a1', 'a1', Opts>>().toEqualTypeOf<t.ValidateErrorResult>()
    expectTypeOf<t.ValidateReturnType<number, number, string, string, Opts>>().toEqualTypeOf<t.ValidateResult<number>>()
  })
})
