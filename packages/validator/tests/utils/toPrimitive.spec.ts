import { describe, expect, test } from 'vitest'

import { toPrimitive } from '../../src/utils'

test('primitive', () => {
  expect(toPrimitive(1)).toBe(1)
  expect(toPrimitive(0)).toBe(0)
  expect(toPrimitive(NaN)).toBe(NaN)
  expect(toPrimitive(Infinity)).toBe(Infinity)
  expect(toPrimitive(-Infinity)).toBe(-Infinity)
  expect(toPrimitive(true)).toBe(true)
  expect(toPrimitive(1n)).toBe(1n)
  expect(toPrimitive('')).toBe('')
  expect(toPrimitive('1')).toBe('1')
  const sym = Symbol('')
  expect(toPrimitive(sym)).toBe(sym)
  expect(toPrimitive({})).toStrictEqual({})
  expect(toPrimitive(null)).toBe(null)
  expect(toPrimitive(undefined)).toBe(undefined)
})
test('boxed primitive', () => {
  expect(toPrimitive(Object(1))).toBe(1)
  expect(toPrimitive(Object(0))).toBe(0)
  expect(toPrimitive(Object(NaN))).toBe(NaN)
  expect(toPrimitive(Object(Infinity))).toBe(Infinity)
  expect(toPrimitive(Object(-Infinity))).toBe(-Infinity)
  expect(toPrimitive(Object(true))).toBe(true)
  expect(toPrimitive(Object(1n))).toBe(1n)
  expect(toPrimitive(Object(''))).toBe('')
  expect(toPrimitive(Object('1'))).toBe('1')
  const sym = Symbol('')
  expect(toPrimitive(Object(sym))).toBe(sym)
  expect(toPrimitive(Object({}))).toStrictEqual({})
  expect(toPrimitive(Object(null))).toStrictEqual({})
  expect(toPrimitive(Object(undefined))).toStrictEqual({})
})
test('object with valueOf', () => {
  expect(toPrimitive({ valueOf: () => 1 })).toBe(1)
  const undefinedValueOf = { valueOf: undefined }
  expect(toPrimitive(undefinedValueOf)).toBe(undefinedValueOf)
  const notFunctionValueOf = { valueOf: 1 }
  expect(toPrimitive(notFunctionValueOf)).toStrictEqual(notFunctionValueOf)

  const emptyArr: unknown[] = []
  expect(toPrimitive(emptyArr)).toBe(emptyArr)
})
test('class', () => {
  expect(toPrimitive(new class extends Number {
    constructor() { super(1) }
  })).toBe(1)
  expect(toPrimitive(new class extends Number {
    constructor() { super(1) }
    valueOf() { return 2 }
  })).toBe(2)
  expect(toPrimitive(new class extends Number {
    constructor() { super(1) }
    [Symbol.toPrimitive]() { return 3 }
  })).toBe(3)
  expect(toPrimitive(new class extends Number {
    constructor() { super(1) }
    valueOf() { return 2 }
    [Symbol.toPrimitive]() { return 3 }
  })).toBe(3)
})
describe('prototype', () => {
  test('Symbol.toPrimitive', () => {
    const oldDesc = Object.getOwnPropertyDescriptor(Number.prototype, Symbol.toPrimitive)
    Object.defineProperty(Number.prototype, Symbol.toPrimitive, {
      configurable: true,
      value() {
        return 1
      }
    })
    expect(toPrimitive(1)).toBe(1)
    expect(toPrimitive(2)).toBe(1)
    expect(toPrimitive(Object(1))).toBe(1)
    expect(toPrimitive(Object(2))).toBe(1)
    if (oldDesc) {
      Object.defineProperty(Number.prototype, Symbol.toPrimitive, oldDesc)
    } else {
      // @ts-ignore
      delete Number.prototype[Symbol.toPrimitive]
    }
  })
  test('valueOf', () => {
    const oldDesc = Object.getOwnPropertyDescriptor(Number.prototype, 'valueOf')
    // - https://github.com/inspect-js/is-bigint/blob/f46c35be813c05549865477bd771300c2595496e/index.js#L6-L14
    Object.defineProperty(Number.prototype, 'valueOf', {
      configurable: true,
      value() { return 2 }
    })
    expect(toPrimitive(1)).toBe(2)
    expect(toPrimitive(2)).toBe(2)
    expect(toPrimitive(Object(1))).toBe(2)
    expect(toPrimitive(Object(2))).toBe(2)
    if (oldDesc) {
      Object.defineProperty(Number.prototype, 'valueOf', oldDesc)
    } else {
      // @ts-ignore
      delete Number.prototype.valueOf
    }
  })
  test('toString', () => {
    // `unboxPrimitive` is dependent `toString` to check type is primitive
    // - https://github.com/inspect-js/is-number-object/blob/cb8423cd42bded7c9321e785a97c5305c2706b02/index.js#L3-L14
    // - https://github.com/inspect-js/is-boolean-object/blob/befa203ffa0e94c70d5b35aae407ea93e0bbc117/index.js#L4-L5
    // - https://github.com/inspect-js/is-string/blob/64015720bd63e517d84752eb750bc78178bf707c/index.js#L3-L14
    // - https://github.com/inspect-js/is-symbol/blob/06be1a9d1bf57181e35b1ffe446196243cc8becc/index.js#L3-L7

    // const oldDesc = Object.getOwnPropertyDescriptor(Number.prototype, 'toString')
    // Object.defineProperty(Number.prototype, 'toString', {
    //   configurable: true,
    //   value() { return 3n }
    // })
    // expect(toPrimitive(1n)).toBe(3n)
    // expect(toPrimitive(2n)).toBe(3n)
    // expect(toPrimitive(Object(1n))).toBe(3n)
    // expect(toPrimitive(Object(2n))).toBe(3n)
    // if (oldDesc) {
    //   Object.defineProperty(Number.prototype, 'toString', oldDesc)
    // } else {
    //   // @ts-ignore
    //   delete Number.prototype.toString
    // }
  })
})
