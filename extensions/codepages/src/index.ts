
import textEncoder from './text-encoder'
import { ExtensionActivateExport } from '@ciphereditor/library'

export const activate: ExtensionActivateExport = (context) => [
  textEncoder
]
