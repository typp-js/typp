export const trimIndent = (text: string) => {
  const lines = text.split('\n')
  const indent = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)![0].length)
    .reduce((min, indent) => Math.min(min, indent), Infinity)
  return lines.map((line) => line.slice(indent)).join('\n')
}
