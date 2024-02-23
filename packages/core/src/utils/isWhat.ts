const notMatched: unique symbol = Symbol('notMatched')
/**
 * By using the built-in type guarding strategy, you can indirectly generate an `is` function without explicitly declaring
 * the return type of the `is` function. This allows you to focus less on type declarations.
 *
 * @example
 * ```ts
 * const onlyStrings = ['a', 'b', 1, 2]
 *   .filter((x): x is string => typeof x === 'string')
 * // Code like the one above can be handled using `isWhat` without explicitly declaring the return type
 * const onlyStrings = ['a', 'b', 1, 2]
 *   .filter(isWhat((x, _) => typeof x === 'number' ? x : _))
 * // The general pattern can be written as
 * const onlyWhatType = ['a', 'b', 1, 2]
 *   .filter(isWhat((x, _) => (${write type guard conditional expression}) ? x : _))
 * ```
 */
export function isWhat<Input = unknown, T = never>(
  match: (input: Input, _: typeof notMatched) => T | typeof notMatched
): (
  <O extends (
    [T] extends [Input] ? Input & T : never
  )>(x: Input) => x is O
) {
  return ((x: any): boolean => {
    try {
      return match(x, notMatched) !== notMatched
    } catch (e) {
      if ([notMatched, void 0, null, TypeError].includes(e as any)) {
        return false
      }
      throw e
    }
  }) as any
}
