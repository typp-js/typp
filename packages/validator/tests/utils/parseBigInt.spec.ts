import { describe, expect, test } from 'vitest'

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
  expect(parseBigInt('-1')).toBe(-1n)
  expect(parseBigInt('+1')).toBe(1n)
  expect(parseBigInt('00')).toBe(0n)
  expect(parseBigInt('-0')).toBe(0n)
  expect(parseBigInt('+0')).toBe(0n)
  expect(parseBigInt('001')).toBe(1n)

  expect(parseBigInt('0.')).toBe(0n)
  expect(parseBigInt('0n')).toBe(0n)
  expect(parseBigInt('0a')).toBe(0n)
  expect(parseBigInt('0a0')).toBe(0n)
  expect(parseBigInt('0a1')).toBe(0n)
  expect(parseBigInt('1a')).toBe(1n)
  expect(parseBigInt('1a0')).toBe(1n)
  expect(parseBigInt('1a1')).toBe(1n)

  expect(() => parseBigInt('-'))
    .toThrow(new SyntaxError('Cannot convert - to a BigInt'))
  expect(() => parseBigInt('+'))
    .toThrow(new SyntaxError('Cannot convert + to a BigInt'))
  expect(() => parseBigInt('a'))
    .toThrow(new SyntaxError('Cannot convert a to a BigInt'))
  expect(() => parseBigInt('aa'))
    .toThrow(new SyntaxError('Cannot convert aa to a BigInt'))
  expect(() => parseBigInt('aaa'))
    .toThrow(new SyntaxError('Cannot convert aaa to a BigInt'))

  expect(parseBigInt(' ')).toBe(0n)
  expect(parseBigInt('  ')).toBe(0n)
  expect(parseBigInt(' 1 ')).toBe(1n)
  expect(parseBigInt(' 0 ')).toBe(0n)
  expect(parseBigInt(' 01 ')).toBe(1n)
  expect(parseBigInt(' 01111 ')).toBe(1111n)

  expect(() => parseBigInt(' -'))
    .toThrow(new SyntaxError('Cannot convert  - to a BigInt'))
  expect(() => parseBigInt(' +'))
    .toThrow(new SyntaxError('Cannot convert  + to a BigInt'))
  expect(() => parseBigInt(' a'))
    .toThrow(new SyntaxError('Cannot convert  a to a BigInt'))
  expect(() => parseBigInt(' aa'))
    .toThrow(new SyntaxError('Cannot convert  aa to a BigInt'))

  expect(() => parseBigInt(' - '))
    .toThrow(new SyntaxError('Cannot convert  -  to a BigInt'))
  expect(() => parseBigInt(' + '))
    .toThrow(new SyntaxError('Cannot convert  +  to a BigInt'))
  expect(() => parseBigInt(' a '))
    .toThrow(new SyntaxError('Cannot convert  a  to a BigInt'))
  expect(() => parseBigInt(' aa '))
    .toThrow(new SyntaxError('Cannot convert  aa  to a BigInt'))
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

describe('other radixes', () => {
  test('like BigInt', () => {
    // base10
    expect(parseBigInt('0b')).toBe(0n)
    // base2
    expect(parseBigInt('0b0')).toBe(0b0n)
    expect(parseBigInt('+0b0')).toBe(0b0n)
    expect(parseBigInt('-0b0')).toBe(0b0n)
    expect(parseBigInt('-0b0')).toBe(-0b0n)
    expect(parseBigInt('-0b1')).toBe(-0b1n)
    expect(parseBigInt('0b11')).toBe(0b11n)

    // base10
    expect(parseBigInt('0o')).toBe(0n)
    // base8
    expect(parseBigInt('0o0')).toBe(0o0n)
    expect(parseBigInt('+0o0')).toBe(0o0n)
    expect(parseBigInt('-0o0')).toBe(0o0n)
    expect(parseBigInt('-0o0')).toBe(-0o0n)
    expect(parseBigInt('-0o1')).toBe(-0o1n)
    expect(parseBigInt('0o11')).toBe(0o11n)

    // base10
    expect(parseBigInt('0x')).toBe(0n)
    // base16
    expect(parseBigInt('0x0')).toBe(0x0n)
    expect(parseBigInt('+0x0')).toBe(0x0n)
    expect(parseBigInt('-0x0')).toBe(0x0n)
    expect(parseBigInt('-0x0')).toBe(-0x0n)
    expect(parseBigInt('-0x1')).toBe(-0x1n)
    expect(parseBigInt('0x11')).toBe(0x11n)
  })
  test('resolve float', () => {
    expect(parseBigInt('0b1.1')).toBe(0b1n)
    expect(parseBigInt('0o1.1')).toBe(0o1n)
    expect(parseBigInt('0x1.1')).toBe(0x1n)
  })
  test('with characters', () => {
    // radix 2
    expect(parseBigInt('0b0n')).toBe(0b0n)
    expect(parseBigInt('0b1n')).toBe(0b1n)
    // radix 10
    expect(parseBigInt('0b2n')).toBe(0n)
    expect(parseBigInt('0bit')).toBe(0n)
    expect(parseBigInt('0byte')).toBe(0n)
    // radix 2
    expect(parseBigInt('0b12x')).toBe(0b1n)

    // radix 8
    expect(parseBigInt('0o0n')).toBe(0o0n)
    expect(parseBigInt('0o1n')).toBe(0o1n)
    // radix 10
    expect(parseBigInt('0o8n')).toBe(0n)
    expect(parseBigInt('0oit')).toBe(0n)
    // radix 8
    expect(parseBigInt('0o18x')).toBe(0o1n)

    // radix 16
    expect(parseBigInt('0x0n')).toBe(0x0n)
    expect(parseBigInt('0x1n')).toBe(0x1n)
    // radix 10
    expect(parseBigInt('0xgn')).toBe(0n)
    expect(parseBigInt('0xit')).toBe(0n)
    // radix 16
    expect(parseBigInt('0x1gn')).toBe(0x1n)
  })
})
