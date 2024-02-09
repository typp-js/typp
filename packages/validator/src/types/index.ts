import type { t as tn } from '@typp/core'

import { bigintValidator } from './primitive.bigint'
import { numberValidator } from './primitive.number'

export function typesValidator(t: typeof tn) {
  t.use(numberValidator)
  t.use(bigintValidator)
}
