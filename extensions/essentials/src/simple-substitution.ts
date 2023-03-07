
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { hasUniqueElements } from './lib/array'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/unicode'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/simple-substitution',
  label: 'Simple substitution cipher',
  description: 'A simple substitution cipher replaces each letter in the plaintext alphabet by a letter in the fixed ciphertext alphabet.',
  url: 'https://ciphereditor.com/explore/simple-substitution-cipher',
  keywords: ['monoalphabetic cipher', 'atbash'],
  controls: [
    {
      name: 'plaintext',
      value: 'the quick brown fox jumps over the lazy dog',
      types: ['text']
    },
    {
      name: 'plaintextAlphabet',
      value: 'abcdefghijklmnopqrstuvwxyz',
      types: ['text']
    },
    {
      name: 'ciphertextAlphabet',
      value: 'zyxwvutsrqponmlkjihgfedcba',
      types: ['text']
    },
    {
      name: 'ciphertext',
      value: 'gsv jfrxp yildm ulc qfnkh levi gsv ozab wlt',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request

  const plaintextAlphabet = values.plaintextAlphabet as string
  const plaintextAlphabetChars = stringToUnicodeCodePoints(plaintextAlphabet)

  const ciphertextAlphabet = values.ciphertextAlphabet as string
  const ciphertextAlphabetChars = stringToUnicodeCodePoints(ciphertextAlphabet)

  const encode =
    controlPriorities.indexOf('plaintext') <
    controlPriorities.indexOf('ciphertext')

  // Validate input
  const issues: OperationIssue[] = []

  if (!hasUniqueElements(plaintextAlphabetChars)) {
    issues.push({
      level: 'error',
      targetControlNames: ['plaintextAlphabet'],
      message: 'Must not contain duplicate characters'
    })
  }

  if (!hasUniqueElements(ciphertextAlphabetChars)) {
    issues.push({
      level: 'error',
      targetControlNames: ['ciphertextAlphabet'],
      message: 'Must not contain duplicate characters'
    })
  }

  if (plaintextAlphabetChars.length !== ciphertextAlphabetChars.length) {
    issues.push({
      level: 'error',
      targetControlNames: ['plaintextAlphabet', 'ciphertextAlphabet'],
      message: 'Plaintext and ciphertext alphabets must be of equal length'
    })
  }

  // Bail out, if the input is not valid
  if (issues.length > 0) {
    return { issues }
  }

  // Encode or decode
  if (encode) {
    const plaintext = values.plaintext as string
    const ciphertext = simpleSubstitutionEncode(
      plaintext, plaintextAlphabet, ciphertextAlphabet)
    return { changes: [{ name: 'ciphertext', value: ciphertext }] }
  } else {
    const ciphertext = values.ciphertext as string
    const plaintext = simpleSubstitutionEncode(
      ciphertext, ciphertextAlphabet, plaintextAlphabet)
    return { changes: [{ name: 'plaintext', value: plaintext }] }
  }
}

/**
 * Encode the given plaintext using the Simple substitution cipher.
 * To decode, simply swap args `plaintextAlphabet` and `ciphertextAlphabet`.
 */
export const simpleSubstitutionEncode = (
  plaintext: string,
  plaintextAlphabet: string,
  ciphertextAlphabet: string
): string => {
  const map = generateSimpleSubstitutionMap(plaintextAlphabet, ciphertextAlphabet)
  const plaintextChars = stringToUnicodeCodePoints(plaintext)
  const ciphertextChars = plaintextChars.map(char => map.get(char) ?? char)
  return stringFromUnicodeCodePoints(ciphertextChars)
}

let cachedPlaintextAlphabet: string | undefined
let cachedCiphertextAlphabet: string | undefined
let cachedMap: Map<number, number> | undefined

/**
 * Generate a Map that maps known code points from a plaintext alphabet to
 * code points in the ciphertext.
 *
 * Assumes the number of the plaintext and ciphertext alphabet Unicode
 * code points to be equal.
 */
const generateSimpleSubstitutionMap = (
  plaintextAlphabet: string,
  ciphertextAlphabet: string
): Map<number, number> => {
  // Return cached version, if available
  if (
    cachedPlaintextAlphabet === plaintextAlphabet &&
    cachedCiphertextAlphabet === ciphertextAlphabet &&
    cachedMap !== undefined
  ) {
    return cachedMap
  }

  // Turn alphabet strings into arrays of Unicode code points
  const plaintextChars =
    stringToUnicodeCodePoints(plaintextAlphabet)
  const ciphertextChars =
    stringToUnicodeCodePoints(ciphertextAlphabet)

  // Also prepare lower case and upper case versions of the alphabets to
  // allow maintaining the casing of letters
  const lowerCasePlaintextChars =
    stringToUnicodeCodePoints(plaintextAlphabet.toLowerCase())
  const upperCasePlaintextChars =
    stringToUnicodeCodePoints(plaintextAlphabet.toUpperCase())
  const lowerCaseCiphertextChars =
    stringToUnicodeCodePoints(ciphertextAlphabet.toLowerCase())
  const upperCaseCiphertextChars =
    stringToUnicodeCodePoints(ciphertextAlphabet.toUpperCase())

  // Build substitution map
  const map: Map<number, number> = new Map()
  const m = plaintextChars.length

  // Map out lower case and upper case versions of the key to make the
  // simple substitution work no matter what casing was used
  for (let i = 0; i < m; i++) {
    map.set(upperCasePlaintextChars[i], upperCaseCiphertextChars[i])
    map.set(lowerCasePlaintextChars[i], lowerCaseCiphertextChars[i])
  }

  // Prefer the unchanged case over the lower case over the upper case version
  for (let i = 0; i < m; i++) {
    map.set(plaintextChars[i], ciphertextChars[i])
  }

  // Cache and return generated map
  cachedPlaintextAlphabet = plaintextAlphabet
  cachedCiphertextAlphabet = ciphertextAlphabet
  cachedMap = map
  return map
}

export default {
  contribution,
  body: {
    execute
  }
}
