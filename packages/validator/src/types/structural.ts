import type { IsEqual, Switch, SwitchOtherEntry, t as tn } from '@typp/core'

import { FALSY } from '../base'

// TODO object
// TODO dictionary
// TODO record
// TODO class/instanceof

declare module '@typp/core' {
  namespace t {
    export interface ErrorArgsMap {
      'ValidateError:tuple length not match': [expected: number, actual: number]
      'ValidateError:item of array not match': [index: number, error: tn.ValidateError]
    }
    export interface ValidateExtendsEntries<T> {
      array: [
        [T] extends [unknown[]] ? true : false, T
      ]
    }
    export interface ValidateTransformEntries<T, Input, InputRest> {
      array: [
        [T] extends [unknown[]] ? true : false,
        Switch<{
          null: [
            IsEqual<Input, null>, []
          ]
          // TODO Set, WeakSet
          ArrayLike: [
            [Input] extends [ArrayLike<unknown>] ? true : false,
            [Input] extends [{ length: number }]
              ? T
              : [Input] extends [ArrayLike<infer I>]
                ? I[]
                : never
          ]
        } & {
          [K in SwitchOtherEntry]: Input
        }>
      ]
    }
  }
}

export function structuralValidator(t: typeof tn) {
  t.use(arrayValidator)
}

export function arrayValidator(t: typeof tn) {
  const { ValidateError } = t

  t.useValidator((s): s is tn.Schema<any[], any[]> => {
    return Array.isArray(s.shape)
    // TODO Array.isArray(Array.prototype) === true
    //      I think `Array.prototype` is an object but not an array, but the logic is not good.
    //      Maybe I should get more information to determine if it's an array.
    // && s.shape !== Array.prototype
  }, {
    validate(input) {
      if (!Array.isArray(input)) {
        return false
      }
      const isTuple = Object.hasOwnProperty.call(this, 'length')
      const length = isTuple ? this.length : input.length
      if (isTuple && input.length !== this.length) {
        throw new ValidateError(
          'partially match', this, input,
          'ValidateError:tuple length not match', [this.shape.length, input.length]
        )
      }
      for (let i = 0; i < length; i++) {
        const shapeItem: tn.Schema<unknown, unknown> = isTuple
          ? this.shape[i]
          : this.shape[0]
        const inputItem = input[i] as unknown
        const result = shapeItem.tryValidate(inputItem)
        if (!result.success) {
          throw new ValidateError(
            'partially match', this, input,
            'ValidateError:item of array not match', [i, result.error]
          )
        }
      }
      return true
    },
    transform(input, options) {
      if (FALSY.includes(input)) return []
      if (typeof input === 'object' && !Array.isArray(input)) {
        if (input === null) return []

        const isTuple = Object.hasOwnProperty.call(this, 'length')

        if (input instanceof Set) {
          // TODO implement `Set` transform to Array or Tuple
        }
        const lengthOrUndefined = 'length' in input ? input.length : undefined
        if (lengthOrUndefined === undefined) {
          return input
        }
        const length = parseInt(String(lengthOrUndefined), 10)
        if (isNaN(length)) {
          return input
        }
        const result = new Array(length)
        for (let i = 0; i < length; i++) {
          const item = input[i as keyof typeof input] ?? undefined
          const shapeItem: tn.Schema<unknown, unknown> = isTuple
            ? this.shape[i]
            : this.shape[0]
          result[i] = shapeItem.parse(item, options)
        }
        return result
      }
      return input
    }
  })
}
