
import encryption from './encryption'
import generateKey from './generate-key'
import inspectKey from './inspect-key'
import { ExtensionActivateExport } from '@ciphereditor/library'

export const activate: ExtensionActivateExport = (context) => [
  encryption,
  generateKey,
  inspectKey
]
