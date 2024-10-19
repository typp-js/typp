import type { t as tn } from '@typp/core'

import { MAX_TIME, validatorSkeleton } from '@typp/validator/base'
import { typesValidator } from '@typp/validator/types'
import { preprocess } from '@typp/validator/utils'

export default function validator(t: typeof tn) {
  t.use(validatorSkeleton)

  t.use(typesValidator)

  t.useValidator([Date], {
    preprocess,
    validate: input => input instanceof Date,
    transform: input => {
      switch (typeof input) {
        case 'string':
          // TODO number string or bigint string
          if (Number.isNaN(Date.parse(input))) {
            // TODO throw transform error of parse error
          }
        // eslint-disable-next-line no-fallthrough
        case 'number':
          if (input === Infinity) {
            return new Date(MAX_TIME)
          } else if (input === -Infinity) {
            return new Date(-MAX_TIME)
          }
          return new Date(input)
        case 'bigint': {
          const num = Number(input)
          if (num > Number.MAX_SAFE_INTEGER) {
            return new Date(MAX_TIME)
          } else if (num < Number.MIN_SAFE_INTEGER) {
            return new Date(-MAX_TIME)
          }
          return new Date(num)
        }
      }
    }
  })
}
export { validator }

export * from '@typp/validator/base'
export * from '@typp/validator/error'
