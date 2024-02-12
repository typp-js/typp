import type { t as tn } from '@typp/core'

import { bigintValidator } from './primitive.bigint'
import { booleanValidator } from './primitive.boolean'
import { numberValidator } from './primitive.number'
import { stringValidator } from './primitive.string'

export function typesValidator(t: typeof tn) {
  t.use(bigintValidator)
  t.use(booleanValidator)
  t.use(numberValidator)
  t.use(stringValidator)
}
