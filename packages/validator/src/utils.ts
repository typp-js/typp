import unboxPrimitive from 'unbox-primitive'

export function parseBigInt(inputStr: string): bigint {
  const str = inputStr.trim()

  if (str.length === 0)
    return 0n
  if (str.length === 1) {
    if (!/\d/.test(str))
      throw new SyntaxError(`Cannot convert ${inputStr} to a BigInt`)
    return BigInt(str)
  }
  if (str.length === 2) {
    const [first] = str
    if (/^\d\D/.test(str))
      return BigInt(first)
    if (!/[-+\d]\d/.test(str))
      throw new SyntaxError(`Cannot convert ${inputStr} to a BigInt`)
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
    if (!tenRadixMatchResult)
      throw new SyntaxError(`Cannot convert ${inputStr} to a BigInt`)

    const [, integer, fraction, offsetStr] = tenRadixMatchResult
    const offset = offsetStr ? parseInt(offsetStr) : 0
    if (offset > Number.MAX_SAFE_INTEGER)
      throw new RangeError('Exponential part is too large')
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

export function toPrimitive(val: unknown) {
  if (val === null || val === undefined) return val

  if (typeof val === 'object') {
    let data: any = val
    if (Symbol.toPrimitive in val && typeof val[Symbol.toPrimitive] === 'function') {
      data = (val[Symbol.toPrimitive] as Function)()
    } else if ('valueOf' in val && typeof val.valueOf === 'function') {
      data = val.valueOf()
    } else if ('toString' in val && typeof val.toString === 'function') {
      data = val.toString()
    }
    if (typeof data !== 'object' || data === null || data === undefined)
      return data
    return unboxPrimitive(data)
  }
  return toPrimitive(Object(val))
}
