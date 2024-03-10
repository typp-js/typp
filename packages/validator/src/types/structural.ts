import type { t as tn } from '@typp/core'

// TODO object
// TODO dictionary
// TODO record
// TODO class/instanceof
// TODO function
// TODO array
// TODO tuple

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
        Input
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
  }, {
    validate(input) {
      if (!Array.isArray(input)) {
        return false
      }
      // TODO partially errors
      // distribute array and tuple
      if (Object.hasOwnProperty.call(this, 'length')) {
        // tuple
        for (let i = 0; i < this.shape.length; i++) {
          const shapeItem = this.shape[i] as tn.Schema<unknown, unknown>
          const inputItem = input[i] as unknown
          const result = shapeItem.tryValidate(inputItem)
          if (!result.success) {
            throw new ValidateError(
              'partially match', this, input,
              'ValidateError:item of array not match', [i, result.error]
            )
          }
        }
        if (input.length !== this.shape.length) {
          throw new ValidateError(
            'partially match', this, input,
            'ValidateError:tuple length not match', [this.shape.length, input.length]
          )
        }
      } else {
        // array
        const shapeItem = this.shape[0] as tn.Schema<unknown, unknown>
        for (let i = 0; i < input.length; i++) {
          const inputItem = input[i] as unknown
          const result = shapeItem.tryValidate(inputItem)
          if (!result.success) {
            throw new ValidateError(
              'partially match', this, input,
              'ValidateError:item of array not match', [i, result.error]
            )
          }
        }
      }
      return true
    },
    transform(input, options) {
      return input
    }
  })
}
