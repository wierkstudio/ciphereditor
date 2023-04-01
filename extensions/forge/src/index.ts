
import aes from './aes'
import des from './des'
import { ExtensionActivateExport } from '@ciphereditor/library'

export const activate: ExtensionActivateExport = (context) => [
  aes,
  des
]
