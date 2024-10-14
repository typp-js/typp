import { t } from '@typp/core/base'
import * as consumers from './consumers'

for (const consumer of Object.values(consumers)) {
  consumer(t)
}

export { consumers }
export * from '@typp/core/base'
export { t as typp } from '@typp/core/base'
