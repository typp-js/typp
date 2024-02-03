export function parseBigInt(str: string): bigint {
  const sign = str[0] === '-' ? -1n : 1n
  let numStr
  const tenRadixMatchResult = str.match(/^-?(\d+)(?:\.(?:(\d+)?0*)?)?(?:e([+-]?\d+)?)?/)
  if (tenRadixMatchResult) {
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
  } else {
    // TODO support other radix
    numStr = ''
  }
  return sign * BigInt(numStr)
}
