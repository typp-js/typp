export const notMatched: unique symbol = Symbol('notMatched')

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
 *   .filter(isWhat(x => typeof x === 'number' ? x : notMatched))
 * // The general pattern can be written as
 * const onlyWhatType = ['a', 'b', 1, 2]
 *   .filter(isWhat(x => (${write type guard conditional expression}) ? x : notMatched))
 * ```
 */
export function isWhat<T>(match: (x: unknown) => T | typeof notMatched): (x: unknown) => x is T {
  return (x): x is T => match(x) !== notMatched
}
