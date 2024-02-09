import type { t as tn } from '@typp/core'

import { bigintValidator } from './primitive.bigint'
import { booleanValidator } from './primitive.boolean'
import { numberValidator } from './primitive.number'

export function typesValidator(t: typeof tn) {
  t.use(bigintValidator)
  t.use(booleanValidator)
  t.use(numberValidator)
}
