
import binaryToText from './binary-to-text'
import bitwiseOperator from './bitwise-operator'
import caesarCipher from './caesar-cipher'
import caseTransform from './case-transform'
import concatenate from './concatenate'
import googleTranslate from './google-translate'
import letterNumberCipher from './letter-number-cipher'
import logicalAnd from './logical-and'
import logicalNot from './logical-not'
import logicalOr from './logical-or'
import numberEncoder from './number-encoder'
import polybiusSquare from './polybius-square'
import rc4Cipher from './rc4-cipher'
import rot13 from './rot13'
import swapEndianness from './swap-endianness'
import vigenereCipher from './vigenere-cipher'
import wordCounter from './word-counter'
import { ExtensionActivateExport } from '@ciphereditor/library'

export const activate: ExtensionActivateExport = (context) => [
  binaryToText,
  bitwiseOperator,
  caesarCipher,
  caseTransform,
  concatenate,
  googleTranslate,
  letterNumberCipher,
  logicalAnd,
  logicalNot,
  logicalOr,
  numberEncoder,
  polybiusSquare,
  rc4Cipher,
  rot13,
  swapEndianness,
  vigenereCipher,
  wordCounter
]
