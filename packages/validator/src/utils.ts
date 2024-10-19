import type { Transform } from './types'

export function parseBigInt(inputStr: string): bigint {
  const str = inputStr.trim()

  if (str.length === 0) {
    return 0n
  }
  if (str.length === 1) {
    if (!/\d/.test(str)) {
      throw new SyntaxError(`Cannot convert ${inputStr} to a BigInt`)
    }
    return BigInt(str)
  }
  if (str.length === 2) {
    const [first] = str
    if (/^\d\D/.test(str)) {
      return BigInt(first)
    }
    if (!/[-+\d]\d/.test(str)) {
      throw new SyntaxError(`Cannot convert ${inputStr} to a BigInt`)
    }
    return BigInt(str)
  }
  const sign = str[0] === '-' ? -1n : 1n
  let numStr
  // 0[bBoOxX]
  // 0b     -> 0  [base10]
  // 0b0    -> 0  [base2]
  // 0b1    -> 1  [base2]
  // 0b2    -> 0  [base10]
  // 0b1x   -> 1  [base2]
  // 0bit   -> 0  [base10]
  // 0byte  -> 0  [base10]
  // 1b0    -> 1  [base10]
  // 1b1    -> 1  [base10]
  // 0b10   -> 2  [base2]
  // 00b0   -> 0  [base10]
  // 01b0   -> 1  [base10]
  // 10b0   -> 10 [base10]
  // 当输入字符串以 0b 开头且格式满足二进制数的格式时，才将其看作为二进制数进行处理
  // 如果将所有的以 0b 开头的字符串都看作二进制数，那么将无法处理 `0bit` 类似的这样带单位存在一定意义的字符串
  // 0x, 0o 同理
  // 但是，对于把输入看作二进制数并进行检查的行为便不支持了，比如说想要检查 0b2 是不是一个合法的二进制数，在这里无法得到报错
  // 我们只能得到，它会被尽可能的处理为 0，而不会得到 `SyntaxError(`Cannot convert 0b2 to a BigInt`)`
  // 这一点是与 parseInt 不同的，因为 parseInt 无法处理 0b，我们拿 0x 来举例
  // * parseInt('0x2') 会得到 2
  // * parseInt('0xx') 会得到 NaN，如果按照我们的想法，应该是 0 才对，尽可能去处理用户输入的字符串到数字
  // * parseInt('0x2x') 会得到 2
  const notBase10 = str.match(/^[+-]?(0[bB][01]+|0[oO][0-7]+|0[xX][0-9a-fA-F]+)/)
  if (notBase10) {
    const [, inputStr] = notBase10
    numStr = inputStr
  } else {
    const tenRadixMatchResult = str.match(/^[+-]?(\d+)(?:\.(?:(\d+)?0*)?)?(?:e([+-]?\d+)?)?/)
    if (!tenRadixMatchResult) {
      throw new SyntaxError(`Cannot convert ${inputStr} to a BigInt`)
    }

    const [, integer, fraction, offsetStr] = tenRadixMatchResult
    const offset = offsetStr ? parseInt(offsetStr) : 0
    if (offset > Number.MAX_SAFE_INTEGER) {
      throw new RangeError('Exponential part is too large')
    }
    const floatStr = integer + (fraction ?? '')
    const dotIndex = integer.length
    const newDotIndex = dotIndex + offset
    if (newDotIndex < 0) {
      numStr = '0'
    } else if (newDotIndex >= floatStr.length) {
      numStr = floatStr + '0'.repeat(newDotIndex - floatStr.length)
    } else {
      if (newDotIndex < 0) {
        numStr = '0'
      } else {
        numStr = floatStr.slice(0, newDotIndex)
      }
    }
  }
  return sign * BigInt(numStr)
}

/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-getmethod
 */
function getMethod(obj: unknown, key: string | symbol): Function | undefined {
  const func = Reflect.get(Object(obj), key)
  if (func === undefined || func === null) {
    return undefined
  }
  if (typeof func === 'function') {
    return func
  }
  throw new TypeError(`${func} is not a function`)
}

type Primitive = number | bigint | boolean | string | symbol | object | null | undefined

/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-ordinarytoprimitive
 */
function ordinaryToPrimitive(o: object, hint: 'number' | 'string' | (string & {})) {
  let methodNames: [string, string]
  if (hint === 'string') {
    methodNames = ['toString', 'valueOf']
  } else {
    methodNames = ['valueOf', 'toString']
  }
  for (const methodName of methodNames) {
    const method = Reflect.get(o, methodName)
    if (typeof method === 'function') {
      const result = Reflect.apply(method, o, [])
      if (typeof result !== 'object') {
        return result
      }
    }
  }
  throw new TypeError('Cannot convert object to primitive value')
}

/**
 * @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toprimitive
 */
export function toPrimitive(input: unknown, preferredType: 'number' | 'string' | 'default' = 'default'): Primitive {
  if (typeof input === 'object' && input !== null) {
    const exoticToPrim = getMethod(input, Symbol.toPrimitive)
    let hint: 'number' | 'string' | 'default' = preferredType
    if (exoticToPrim !== undefined) {
      if (!['number', 'string', 'default'].includes(hint)) {
        hint = 'default'
      }

      const result = Reflect.apply(exoticToPrim, input, [hint])
      if (typeof result !== 'object') {
        return result
      }
      throw new TypeError('Cannot convert object to primitive value')
    }
    if (!['number', 'string', 'default'].includes(preferredType)) {
      preferredType = 'number'
    }
    return ordinaryToPrimitive(input, preferredType)
  }
  return input as Primitive
}

export const preprocess: Transform = (input, options) => toPrimitive(input)
