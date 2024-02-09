import type { t as tn } from '@typp/core'

import { numberValidator } from './primitive.number'

export function typesValidator(t: typeof tn) {
  t.use(numberValidator)
}
