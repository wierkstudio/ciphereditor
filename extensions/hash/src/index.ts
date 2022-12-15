
import hash from './hash'
import hmac from './hmac'
import { ExtensionActivateExport } from '@ciphereditor/library'

export const activate: ExtensionActivateExport = (context) => [
  hash,
  hmac
]
