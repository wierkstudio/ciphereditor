
import hash from './hash'
import hmac from './hmac'
import { ExtensionActivateExport } from '@ciphereditor/types'

export const activate: ExtensionActivateExport = (context) => [
  hash,
  hmac
]
