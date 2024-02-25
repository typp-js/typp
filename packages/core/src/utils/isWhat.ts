const notMatched: unique symbol = Symbol('notMatched')
export type notMatched = typeof notMatched
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
 * @example
 * ```ts
 * // Limit the input type to `string | number`
 * const isString = isWhat((x: string | number, _) => typeof x === 'string' ? x : _)
 * isString('a') // true
 * isString(1) // false
 * isString(null) // throw ts error
 *
 * // Limit the input type to `string | number` with generic
 * const isString = isWhat(<T extends string | number>(x: T, _: notMatched) => typeof x === 'string' ? x : _)
 * const t0 = 'a' as const
 * if (isString(t0)) {
 *   // t0 is 'a'
 * }
 * ```
 */
export function isWhat<Input = unknown, T = unknown>(
  match: (input: Input, _: notMatched) => T | notMatched
): (
  (input: Input) => input is [T] extends [Input] ? Input & T : never
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
