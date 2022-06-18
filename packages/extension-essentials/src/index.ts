
import caesarCipher from './caesar-cipher'
import googleTranslate from './google-translate'
import logicalAnd from './logical-and'
import logicalNot from './logical-not'
import logicalOr from './logical-or'
import rot13 from './rot13'
import wordCounter from './word-counter'
import { ExtensionActivateExport } from '@cryptii/types'

export const activate: ExtensionActivateExport = (context) => [
  caesarCipher,
  googleTranslate,
  logicalAnd,
  logicalNot,
  logicalOr,
  rot13,
  wordCounter
]
