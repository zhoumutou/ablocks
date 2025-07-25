import { base58 } from '@scure/base'
import { randomBytes } from './crypto'

export const uuid = (length = 12) => base58.encode(randomBytes(32)).slice(0, length)
