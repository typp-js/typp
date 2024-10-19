import { t } from '@typp/core'
import { validatorSkeleton } from '@typp/validator'
import { ParseError, ValidateError } from '@typp/validator/error'
import { bigintValidator } from '@typp/validator/types/primitive.bigint'
import { booleanValidator } from '@typp/validator/types/primitive.boolean'
import { numberValidator } from '@typp/validator/types/primitive.number'
import { stringValidator } from '@typp/validator/types/primitive.string'

import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest'

beforeAll(() => t.use(validatorSkeleton))

describe('bigint', () => {
  beforeAll(() => t.use(bigintValidator))
  test('base', () => {
    const r0 = t.bigint().validate(1n)
    expect(r0).toBe(1n)
    expectTypeOf(r0).toEqualTypeOf<bigint>()
  })
  test('narrow', () => {
    const r0 = t.bigint().validate.narrow(1n)
    expect(r0).toBe(1n)
    expectTypeOf(r0).toEqualTypeOf<1n>()
  })
  test('instanceof', () => {
    const r0 = t.bigint().validate(BigInt(1))
    expect(r0).toBe(1n)
    expectTypeOf(r0).toEqualTypeOf<bigint>()
    // @ts-expect-error
    const r1 = t.bigint().validate(new Object(1n))
    expect(r1).toBe(1n)
    expectTypeOf(r1).toEqualTypeOf<bigint>()
    // @ts-expect-error
    const r2 = t.bigint().validate(new Object(BigInt(1)))
    expect(r2).toBe(1n)
    expectTypeOf(r2).toEqualTypeOf<bigint>()
  })
  test('unexpected', () => {
    const skm = t.bigint()
    expect(() => {
      // @ts-expect-error
      skm.validate('abc')
    }).toThrow(new ValidateError('unexpected', skm, '1'))
  })
  describe('parse', () => {
    test('transform - primitive.boolean', () => {
      const skm = t.bigint()
      const r0 = skm.parse(true)
      expect(r0).toBe(1n)
      expectTypeOf(r0).toEqualTypeOf<bigint>()
      const r1 = skm.parse(false)
      expect(r1).toBe(0n)
      expectTypeOf(r1).toEqualTypeOf<bigint>()

      // with const
      const r2 = skm.parse.narrow(true)
      expect(r2).toBe(1n)
      expectTypeOf(r2).toEqualTypeOf<1n>()
    })
    test('transform - primitive.number', () => {
      const skm = t.bigint()
      const r0 = skm.parse(1)
      expect(r0).toBe(1n)
      expectTypeOf(r0).toEqualTypeOf<bigint>()

      const r1 = skm.parse(Infinity)
      expect(r1).toBe(2n ** 1024n)
      expectTypeOf(r1).toEqualTypeOf<bigint>()
      const r2 = skm.parse(-Infinity)
      expect(r2).toBe(2n ** 1024n * -1n)
      expectTypeOf(r2).toEqualTypeOf<bigint>()

      const r3 = skm.parse(1.2)
      expect(r3).toBe(1n)
      const r4 = skm.parse(1.2e3)
      expect(r4).toBe(1200n)
      const r5 = skm.parse(1.2e-3)
      expect(r5).toBe(0n)

      // with const
      const r6 = skm.parse.narrow(1)
      expect(r6).toBe(1n)
      expectTypeOf(r6).toEqualTypeOf<1n>()

      expect(() => {
        skm.parse(Number.MAX_SAFE_INTEGER + 1)
      }).toThrow(new ParseError(
        'transform', skm, Number.MAX_SAFE_INTEGER + 1,
        new Error('number must greater than or equal to -2^53 and less than or equal to 2^53'))
      )

      expect(() => {
        skm.parse(Number.NaN)
      }).toThrow(new ParseError(
        'transform', skm, Number.NaN,
        new Error('NaN cannot be converted to BigInt')
      ))
    })
    test('transform - primitive.string', () => {
      const skm = t.bigint()
      const r0 = skm.parse('1')
      expect(r0).toBe(1n)
      expectTypeOf(r0).toEqualTypeOf<bigint>()
      const r1 = skm.parse('0b10')
      const r2 = skm.parse('0B10')
      expect(r1).toBe(2n)
    })
    test('transform - primitive.string - special falsy', () => {})
    test('transform - primitive.symbol', () => {
    })
    test('transform - literal', () => {})
    test('transform - any or unknown', () => {})
    test('transform - any or unknown & try', () => {})
    test('transform - constructor.date', () => {
    })
  })
})
describe('boolean', () => {
  beforeAll(() => t.use(booleanValidator))
  test('base', () => {
    const r0 = t.boolean().validate(true)
    expect(r0).toBe(true)
    expectTypeOf(r0).toEqualTypeOf<boolean>()
    const r1 = t.boolean().validate(false)
    expect(r1).toBe(false)
    expectTypeOf(r1).toEqualTypeOf<boolean>()
  })
  test('narrow', () => {
    const r0 = t.boolean().validate.narrow(true)
    expect(r0).toBe(true)
    expectTypeOf(r0).toEqualTypeOf<true>()
    const r1 = t.boolean().validate.narrow(false)
    expect(r1).toBe(false)
    expectTypeOf(r1).toEqualTypeOf<false>()
  })
  test('instanceof', () => {
    const r0 = t.boolean().validate(Boolean(true))
    expect(r0).toBe(true)
    expectTypeOf(r0).toEqualTypeOf<boolean>()
    // @ts-expect-error
    const r1 = t.boolean().validate(new Object(true))
    expect(r1).toBe(true)
    expectTypeOf(r1).toEqualTypeOf<boolean>()

    const r2 = t.boolean().validate(new class extends Boolean {
      constructor() {
        super(true)
      }
    }())
    expect(r2).toBe(true)
    expectTypeOf(r2).toEqualTypeOf<boolean>()
    const r3 = t.boolean().validate(new class extends Boolean {
      constructor() { super(true) }
      valueOf() { return false }
    })
    expect(r3).toBe(false)
    expectTypeOf(r3).toEqualTypeOf<boolean>()
    const r4 = t.boolean().validate(new class extends Boolean {
      constructor() { super(true) }
      [Symbol.toPrimitive]() { return false }
    })
    expect(r4).toBe(false)
    expectTypeOf(r4).toEqualTypeOf<boolean>()
    const r5 = t.boolean().validate(new class extends Boolean {
      constructor() { super(true) }
      valueOf() { return false }
      [Symbol.toPrimitive]() { return true }
    })
    expect(r5).toBe(true)
    expectTypeOf(r5).toEqualTypeOf<boolean>()
  })
  test('unexpected', () => {
    const skm = t.boolean()
    expect(() => {
      // @ts-expect-error
      skm.validate('abc')
    }).toThrow(new ValidateError('unexpected', skm, '1'))
  })
  describe('parse', () => {
    test('transform - primitive.bigint', () => {
      const skm = t.boolean()
      const r0 = skm.parse(1n)
      expect(r0).toBe(true)
      expectTypeOf(r0).toEqualTypeOf<boolean>()
      const r1 = skm.parse(0n)
      expect(r1).toBe(false)
      expectTypeOf(r1).toEqualTypeOf<boolean>()

      // with const
      const r2 = skm.parse.narrow(1n)
      expect(r2).toBe(true)
      expectTypeOf(r2).toEqualTypeOf<boolean>()
      const r3 = skm.parse.narrow(0n)
      expect(r3).toBe(false)
      expectTypeOf(r3).toEqualTypeOf<boolean>()
    })
    test('transform - primitive.number', () => {
      const skm = t.boolean()
      const r0 = skm.parse(1)
      expect(r0).toBe(true)
      expectTypeOf(r0).toEqualTypeOf<boolean>()
      const r1 = skm.parse(0)
      expect(r1).toBe(false)
      expectTypeOf(r1).toEqualTypeOf<boolean>()
      const r2 = skm.parse(Infinity)
      expect(r2).toBe(true)
      expectTypeOf(r2).toEqualTypeOf<boolean>()
      const r3 = skm.parse(-Infinity)
      expect(r3).toBe(true)
      expectTypeOf(r3).toEqualTypeOf<boolean>()
      const r4 = skm.parse(Number.NaN)
      expect(r4).toBe(false)
      expectTypeOf(r4).toEqualTypeOf<boolean>()

      // TODO: with const
      // const r5 = skm.parse.narrow(1)
      // expect(r5).toBe(true)
      // expectTypeOf(r5).toEqualTypeOf<true>()
      // const r6 = skm.parse.narrow(0)
      // expect(r6).toBe(false)
      // expectTypeOf(r6).toEqualTypeOf<false>()
      // const r7 = skm.parse.narrow(Infinity)
      // expect(r7).toBe(true)
      // expectTypeOf(r7).toEqualTypeOf<true>()
      // const r8 = skm.parse.narrow(-Infinity)
      // expect(r8).toBe(false)
      // expectTypeOf(r8).toEqualTypeOf<false>()
      // const r9 = skm.parse.narrow(NaN)
      // expect(r9).toBe(false)
      // expectTypeOf(r9).toEqualTypeOf<false>()
    })
    test('transform - primitive.string', () => {
      const skm = t.boolean()
      const r0 = skm.parse('true')
      expect(r0).toBe(true)
      expectTypeOf(r0).toEqualTypeOf<boolean>()
      const r1 = skm.parse('false')
      expect(r1).toBe(false)
      expectTypeOf(r1).toEqualTypeOf<boolean>()
      const r2 = skm.parse('abc')
      expect(r2).toBe(true)
      expectTypeOf(r2).toEqualTypeOf<boolean>()
      const r3 = skm.parse('')
      expect(r3).toBe(false)
      expectTypeOf(r3).toEqualTypeOf<boolean>()

      // TODO: with const
    })
    test('transform - primitive.string - special falsy', () => {})
    test('transform - primitive.symbol', () => {})
    test('transform - literal', () => {
      const skm = t.boolean()
      const r0 = skm.parse(null)
      expect(r0).toBe(false)
      expectTypeOf(r0).toEqualTypeOf<boolean>()
      const r1 = skm.parse.narrow(null)
      expect(r1).toBe(false)
      expectTypeOf(r1).toEqualTypeOf<false>()
      const r2 = skm.parse(undefined)
      expect(r2).toBe(false)
      expectTypeOf(r2).toEqualTypeOf<boolean>()
      const r3 = skm.parse.narrow(undefined)
      expect(r3).toBe(false)
      expectTypeOf(r3).toEqualTypeOf<false>()
    })
    test('transform - any or unknown', () => {})
    test('transform - any or unknown & try', () => {})
    test('transform - constructor.date', () => {})
  })
})
describe('number', () => {
  beforeAll(() => t.use(numberValidator))
  test('base', () => {
    const r0 = t.number().validate(1)
    expect(r0).toBe(1)
    expectTypeOf(r0).toEqualTypeOf<number>()

    const r1 = t.number().validate.narrow(1)
    expect(r1).toBe(1)
    expectTypeOf(r1).toEqualTypeOf<1>()
  })
  test('instanceof', () => {
    // eslint-disable-next-line no-new-wrappers,unicorn/new-for-builtins
    const r0 = t.number().validate(new Number(1))
    expect(r0).toBe(1)
    expectTypeOf(r0).toEqualTypeOf<number>()
    const r1 = t.number().validate(Number(1))
    expect(r1).toBe(1)
    expectTypeOf(r1).toEqualTypeOf<number>()
    // @ts-expect-error
    const r2 = t.number().validate(new Object(1))
    expect(r2).toBe(1)
    expectTypeOf(r2).toEqualTypeOf<number>()
    // @ts-expect-error
    const r3 = t.number().validate(new Object(Number(1)))
    expect(r3).toBe(1)
    expectTypeOf(r3).toEqualTypeOf<number>()

    const r4 = t.number().validate(new class extends Number {
      constructor() {
        super(1)
      }
    }())
    expect(r4).toBe(1)
    expectTypeOf(r4).toEqualTypeOf<number>()

    const r5 = t.number().validate(new class extends Number {
      constructor() { super(1) }
      valueOf() { return 2 }
    }())
    expect(r5).toBe(2)
    expectTypeOf(r5).toEqualTypeOf<number>()

    const r6 = t.number().validate(new class extends Number {
      constructor() { super(1) }
      [Symbol.toPrimitive]() { return 3 }
    }())
    expect(r6).toBe(3)
    expectTypeOf(r6).toEqualTypeOf<number>()

    const r7 = t.number().validate(new class extends Number {
      constructor() { super(1) }
      valueOf() { return 2 }
      [Symbol.toPrimitive]() { return 3 }
    }())
    expect(r7).toBe(3)
    expectTypeOf(r7).toEqualTypeOf<number>()

    const numberLike = {
      valueOf: () => 1,
      __proto__: Number.prototype
    } as unknown as Number
    const r8 = t.number().validate(numberLike)
    expect(r8).toBe(1)
    expectTypeOf(r8).toEqualTypeOf<number>()
  })
  test('naN', () => {
    const r = t.number().validate(Number.NaN)
    expect(r).toBeNaN()
    expectTypeOf(r).toEqualTypeOf<number>()
  })
  test('infinity', () => {
    const r0 = t.number().validate(Infinity)
    expect(r0).toBe(Infinity)
    expectTypeOf(r0).toEqualTypeOf<number>()
    const r1 = t.number().validate(-Infinity)
    expect(r1).toBe(-Infinity)
    expectTypeOf(r1).toEqualTypeOf<number>()
  })
  test('unexpected', () => {
    const skm = t.number()
    expect(() => {
      // @ts-expect-error
      skm.validate('abc')
    }).toThrow(new ValidateError('unexpected', skm, '1'))
  })
  describe('parse', () => {
    test('transform - string', () => {
      const skm = t.number()
      const r0 = skm.parse('1')
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()

      // special number
      const r1 = skm.parse('NaN')
      expect(r1).toBeNaN()
      expectTypeOf(r1).toEqualTypeOf<number>()
      const r2 = skm.parse('Infinity')
      expect(r2).toBe(Infinity)
      expectTypeOf(r2).toEqualTypeOf<number>()
      const r3 = skm.parse('-Infinity')
      expect(r3).toBe(-Infinity)
      expectTypeOf(r3).toEqualTypeOf<number>()

      // special radix
      const r4 = skm.parse('0b10')
      const r5 = skm.parse('0B10')
      expect(r4).toBe(2)
      expect(r4).toBe(r5)
      expectTypeOf(r4).toEqualTypeOf<number>()
      expectTypeOf(r4).toEqualTypeOf<typeof r5>()
      const r6 = skm.parse('0o10')
      const r7 = skm.parse('0O10')
      expect(r6).toBe(8)
      expect(r6).toBe(r7)
      expectTypeOf(r6).toEqualTypeOf<number>()
      expectTypeOf(r6).toEqualTypeOf<typeof r7>()
      const r8 = skm.parse('0x1b')
      const r9 = skm.parse('0X1b')
      expect(r8).toBe(27)
      expect(r8).toBe(r9)
      expectTypeOf(r8).toEqualTypeOf<number>()
      expectTypeOf(r8).toEqualTypeOf<typeof r9>()

      // float
      const r10 = skm.parse('1.2')
      expect(r10).toBe(1.2)
      expectTypeOf(r10).toEqualTypeOf<number>()
      const r11 = skm.parse('1.2e3')
      expect(r11).toBe(1200)
      expectTypeOf(r11).toEqualTypeOf<number>()
      const r12 = skm.parse('1.2e-3')
      expect(r12).toBe(0.0012)
      expectTypeOf(r12).toEqualTypeOf<number>()
      const r13 = skm.parse('1.2e+3')
      expect(r13).toBe(1200)
      expectTypeOf(r13).toEqualTypeOf<number>()

      // negative
      const r14 = skm.parse('-1.2')
      expect(r14).toBe(-1.2)
      expectTypeOf(r14).toEqualTypeOf<number>()

      // empty
      const r15 = skm.parse('')
      expect(r15).toBe(0)
      expectTypeOf(r15).toEqualTypeOf<number>()

      // with suffix
      const r16 = skm.parse('1px')
      expect(r16).toBe(1)
      expectTypeOf(r16).toEqualTypeOf<number>()
      const r17 = skm.parse('1.2px')
      expect(r17).toBe(1.2)
      expectTypeOf(r17).toEqualTypeOf<number>()
      const r18 = skm.parse('1.2e3px')
      expect(r18).toBe(1200)
      expectTypeOf(r18).toEqualTypeOf<number>()

      expect(() => {
        expectTypeOf(skm.parse('abc')).toEqualTypeOf<never>()
      }).toThrow(new ValidateError('unexpected', skm, 'abc'))
      expect(() => {
        expectTypeOf(skm.parse('abc' as string)).toEqualTypeOf<number>()
      }).toThrow(new ValidateError('unexpected', skm, 'abc'))
    })
    test('transform - boolean', () => {
      const skm = t.number()
      const r0 = skm.parse(true)
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()
      const r1 = skm.parse(false)
      expect(r1).toBe(0)
      expectTypeOf(r1).toEqualTypeOf<number>()

      // with const
      const r2 = skm.parse.narrow(true)
      expect(r2).toBe(1)
      expectTypeOf(r2).toEqualTypeOf<1>()
    })
    test('transform - null', () => {
      const skm = t.number()
      const r0 = skm.parse(null)
      expect(r0).toBe(0)
      expectTypeOf(r0).toEqualTypeOf<number>()

      // with const
      const r1 = skm.parse.narrow(null)
      expect(r1).toBe(0)
      expectTypeOf(r1).toEqualTypeOf<0>()
    })
    test('transform - undefined', () => {
      const skm = t.number()
      const r0 = skm.parse(undefined)
      expect(r0).toBe(0)
      expectTypeOf(r0).toEqualTypeOf<number>()

      // with const
      const r1 = skm.parse.narrow(undefined)
      expect(r1).toBe(0)
      expectTypeOf(r1).toEqualTypeOf<0>()
    })
    test('transform - bigint', () => {
      const skm = t.number()
      const r0 = skm.parse(1n)
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()

      // with const
      const r1 = skm.parse.narrow(1n)
      expect(r1).toBe(1)
      expectTypeOf(r1).toEqualTypeOf<1>()
      // overflow number
      const r2 = skm.parse.narrow(BigInt(Number.MAX_SAFE_INTEGER) + 1n)
      expect(r2).toBe(Infinity)
      expectTypeOf(r2).toEqualTypeOf<number>()
      const r3 = skm.parse.narrow(-(BigInt(Number.MAX_SAFE_INTEGER) + 1n))
      expectTypeOf(r3).toEqualTypeOf<number>()
    })
    test('transform - any or unknown', () => {
      expectTypeOf(
        t.number().parse(1 as any)
      ).toEqualTypeOf<number>()
      expectTypeOf(
        t.number().parse(1 as unknown)
      ).toEqualTypeOf<number>()
    })
    test('transform - any or unknown & try', () => {
      expectTypeOf(
        t.number().tryParse(1 as any)
      ).toEqualTypeOf<t.ValidateResult<number>>()
      expectTypeOf(
        t.number().tryParse(1 as unknown)
      ).toEqualTypeOf<t.ValidateResult<number>>()
    })
    test('transform - valueOf', () => {
      const skm = t.number()
      const r0 = skm.parse({ valueOf: () => 1 } as Number)
      expect(r0).toBe(1)
      expectTypeOf(r0).toEqualTypeOf<number>()
    })
  })
})
describe('string', () => {
  beforeAll(() => t.use(stringValidator))
  test('base', () => {
    const r0 = t.string().validate('1')
    expect(r0).toBe('1')
    expectTypeOf(r0).toEqualTypeOf<string>()
  })
  test('instanceof', () => {
  })
  test('unexpected', () => {
    const skm = t.string()
    expect(() => {
      // @ts-expect-error
      skm.validate(1)
    }).toThrow(new ValidateError('unexpected', skm, 1))
  })
  describe('parse', () => {
    test('transform - primitive.bigint', () => {
      const skm = t.string()
      const r0 = skm.parse(1n)
      expect(r0).toBe('1')
      expectTypeOf(r0).toEqualTypeOf<string>()
    })
    test('transform - primitive.boolean', () => {
      const skm = t.string()
      const r0 = skm.parse(true)
      expect(r0).toBe('true')
      expectTypeOf(r0).toEqualTypeOf<string>()
      const r1 = skm.parse(false)
      expect(r1).toBe('false')
      expectTypeOf(r1).toEqualTypeOf<string>()
    })
    test('transform - primitive.number', () => {
      const skm = t.string()
      const r0 = skm.parse(1)
      expect(r0).toBe('1')
      expectTypeOf(r0).toEqualTypeOf<string>()

      const r1 = skm.parse(Infinity)
      expect(r1).toBe('Infinity')
      expectTypeOf(r1).toEqualTypeOf<string>()
      const r2 = skm.parse(-Infinity)
      expect(r2).toBe('-Infinity')
      expectTypeOf(r2).toEqualTypeOf<string>()
      const r3 = skm.parse(Number.NaN)
      expect(r3).toBe('NaN')
      expectTypeOf(r3).toEqualTypeOf<string>()
    })
    test('transform - primitive.symbol', () => {})
    test('transform - literal', () => {
      const skm = t.string()
      const r0 = skm.parse(null)
      expect(r0).toBe('null')
      expectTypeOf(r0).toEqualTypeOf<string>()
      const r1 = skm.parse(undefined)
      expect(r1).toBe('undefined')
      expectTypeOf(r1).toEqualTypeOf<string>()
    })

    test('transform - any or unknown', () => {
      expectTypeOf(
        t.string().parse(1 as any)
      ).toEqualTypeOf<string>()
      expectTypeOf(
        t.string().parse(1 as unknown)
      ).toEqualTypeOf<string>()
    })
    test('transform - any or unknown & try', () => {
      expectTypeOf(
        t.string().tryParse(1 as any)
      ).toEqualTypeOf<t.ValidateResult<string>>()
      expectTypeOf(
        t.string().tryParse(1 as unknown)
      ).toEqualTypeOf<t.ValidateResult<string>>()
    })
    test('toString', () => {
      const skm = t.string()
      const r0 = skm.parse({ toString: () => '1' } as String)
      expect(r0).toBe('1')
      expectTypeOf(r0).toEqualTypeOf<string>()
    })
    test('not primitive', () => {
      const objStr = t.string().parse({ a: 1 })
      expect(objStr).toBe('[object Object]')
      expectTypeOf(objStr).toEqualTypeOf<string>()
    })
  })
})
describe('symbol', () => {
})
