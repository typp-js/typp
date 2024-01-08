import { t } from './base'
import * as consumers from './consumers'

for (const consumer of Object.values(consumers)) {
  consumer(t)
}

export * from './base'
export { t as typp } from './base'
