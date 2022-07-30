
import binaryToText from './binary-to-text'
import caesarCipher from './caesar-cipher'
import caseTransform from './case-transform'
import concatenate from './concatenate'
import googleTranslate from './google-translate'
import letterNumberCipher from './letter-number-cipher'
import logicalAnd from './logical-and'
import logicalNot from './logical-not'
import logicalOr from './logical-or'
import rot13 from './rot13'
import vigenereCipher from './vigenere-cipher'
import wordCounter from './word-counter'
import { ExtensionActivateExport } from '@ciphereditor/types'

export const activate: ExtensionActivateExport = (context) => [
  binaryToText,
  caesarCipher,
  caseTransform,
  concatenate,
  googleTranslate,
  letterNumberCipher,
  logicalAnd,
  logicalNot,
  logicalOr,
  rot13,
  vigenereCipher,
  wordCounter
]
