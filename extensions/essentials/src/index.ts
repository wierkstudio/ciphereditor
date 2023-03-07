
import addition from './addition'
import affineCipher from './affine-cipher'
import binarySlice from './binary-slice'
import binaryToText from './binary-to-text'
import bitwiseOperator from './bitwise-operator'
import caesarCipher from './caesar-cipher'
import caseTransform from './case-transform'
import concatenate from './concatenate'
import division from './division'
import googleTranslate from './google-translate'
import indexOfCoincidence from './index-of-coincidence'
import letterNumberCipher from './letter-number-cipher'
import logicalAnd from './logical-and'
import logicalNot from './logical-not'
import logicalOr from './logical-or'
import multiplication from './multiplication'
import numberEncoder from './number-encoder'
import polybiusSquare from './polybius-square'
import railFenceCipher from './rail-fence-cipher'
import rc4Cipher from './rc4-cipher'
import reverser from './reverser'
import rot13 from './rot13'
import simpleSubstitution from './simple-substitution'
import substring from './substring'
import subtraction from './subtraction'
import swapEndianness from './swap-endianness'
import trigonometricFunction from './trigonometric-function'
import vigenereCipher from './vigenere-cipher'
import wordCounter from './word-counter'
import { ExtensionActivateExport } from '@ciphereditor/library'

export const activate: ExtensionActivateExport = (context) => [
  addition,
  affineCipher,
  binarySlice,
  binaryToText,
  bitwiseOperator,
  caesarCipher,
  caseTransform,
  concatenate,
  division,
  googleTranslate,
  indexOfCoincidence,
  letterNumberCipher,
  logicalAnd,
  logicalNot,
  logicalOr,
  multiplication,
  numberEncoder,
  polybiusSquare,
  railFenceCipher,
  rc4Cipher,
  reverser,
  rot13,
  simpleSubstitution,
  substring,
  subtraction,
  swapEndianness,
  trigonometricFunction,
  vigenereCipher,
  wordCounter
]
