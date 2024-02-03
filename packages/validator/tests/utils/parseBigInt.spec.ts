import { expect, test } from 'vitest'

import { parseBigInt } from '../../src/utils'

test('integer', () => {
  expect(parseBigInt('123')).toBe(123n)
  expect(parseBigInt('1'.repeat(10000))).toBe(BigInt('1'.repeat(10000)))
  expect(parseBigInt('-123')).toBe(-123n)
  expect(parseBigInt('-' + '1'.repeat(10000))).toBe(BigInt('-' + '1'.repeat(10000)))

  expect(parseBigInt('')).toBe(0n)
  expect(parseBigInt('1')).toBe(1n)
  expect(parseBigInt('0')).toBe(0n)
  expect(parseBigInt('01')).toBe(1n)
  expect(parseBigInt('00')).toBe(0n)
  expect(parseBigInt('001')).toBe(1n)

  expect(() => parseBigInt('-'))
    .toThrow(new SyntaxError('Cannot convert - to a BigInt'))
  expect(() => parseBigInt('a'))
    .toThrow(new SyntaxError('Cannot convert a to a BigInt'))
  expect(() => parseBigInt('aa'))
    .toThrow(new SyntaxError('Cannot convert aa to a BigInt'))
})
test('float', () => {
  expect(parseBigInt('123.')).toBe(123n)
  expect(parseBigInt('123.456')).toBe(123n)
  expect(parseBigInt('123.0')).toBe(123n)
  expect(parseBigInt('123.01')).toBe(123n)
  expect(parseBigInt('123.99')).toBe(123n)
  expect(parseBigInt('123.000')).toBe(123n)
  expect(parseBigInt('-123.')).toBe(-123n)
  expect(parseBigInt('-123.456')).toBe(-123n)
})
test('exponential', () => {
  expect(parseBigInt('1e')).toBe(1n)
  expect(parseBigInt('1e0')).toBe(1n)
  expect(parseBigInt('1e-1')).toBe(0n)
  expect(parseBigInt('1e1')).toBe(10n)
  expect(parseBigInt('1e+1')).toBe(10n)

  expect(parseBigInt('1.23e0')).toBe(1n)
  expect(parseBigInt('11.23e0')).toBe(11n)
  expect(parseBigInt('1.23e-1')).toBe(0n)
  expect(parseBigInt('1.23e-2')).toBe(0n)
  expect(parseBigInt('11.23e-1')).toBe(1n)
  expect(parseBigInt('1.23e1')).toBe(12n)
  expect(parseBigInt('1.23e2')).toBe(123n)
  expect(parseBigInt('1.23e3')).toBe(1230n)
  expect(parseBigInt('1.23e+3')).toBe(1230n)

  expect(parseBigInt('1.001e+3')).toBe(1001n)
  expect(parseBigInt('1.001e+2')).toBe(100n)

  expect(() => parseBigInt(`1e${Number.MAX_SAFE_INTEGER + 1}`))
    .toThrow(new RangeError('Exponential part is too large'))
})
test('with other characters', () => {
  expect(parseBigInt('123px')).toBe(123n)
  expect(parseBigInt('123.456px')).toBe(123n)
  expect(parseBigInt('123.456epx')).toBe(123n)
  expect(parseBigInt('123.456e0px')).toBe(123n)
  expect(parseBigInt('123.456e1px')).toBe(1234n)
  expect(parseBigInt('123.456e-1px')).toBe(12n)
  expect(parseBigInt('123.456e+1px')).toBe(1234n)

  expect(parseBigInt('123.456 epx')).toBe(123n)
  expect(parseBigInt('123.456 e0px')).toBe(123n)
  expect(parseBigInt('123.456 e1px')).toBe(123n)
  expect(parseBigInt('123.456 e-1px')).toBe(123n)
  expect(parseBigInt('123.456 e+1px')).toBe(123n)
})
