
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { alphabetTextChoices } from './shared/options'
import { gcd, mod } from './lib/math'
import { hasUniqueElements } from './lib/array'
import { simpleSubstitutionEncode } from './simple-substitution'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/string'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/affine-cipher',
  label: 'Affine cipher',
  description: 'The Affine cipher maps each letter in an alphabet to its numeric equivalent, encrypts it using a linear mathematical function, and converts it back to a letter.',
  url: 'https://ciphereditor.com/explore/affine-cipher',
  keywords: ['linear function', 'affine function', 'mathematics'],
  controls: [
    {
      name: 'plaintext',
      value: 'the quick brown fox jumps over the lazy dog',
      types: ['text']
    },
    {
      name: 'a',
      label: 'Slope (a)',
      value: 5,
      types: ['integer']
    },
    {
      name: 'b',
      label: 'Intercept (b)',
      value: 8,
      types: ['integer']
    },
    {
      name: 'alphabet',
      value: 'abcdefghijklmnopqrstuvwxyz',
      types: ['text'],
      options: alphabetTextChoices,
      enforceOptions: false
    },
    {
      name: 'ciphertext',
      value: 'zrc kewsg npaov hat beqfu ajcp zrc lidy xam',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request

  // Gather facts
  const a = values.a as number
  const b = values.b as number

  const plaintextAlphabet = values.alphabet as string
  const plaintextAlphabetChars = stringToUnicodeCodePoints(plaintextAlphabet)
  const m = plaintextAlphabetChars.length

  const encode =
    controlPriorities.indexOf('plaintext') <
    controlPriorities.indexOf('ciphertext')

  // Validate input
  const issues: OperationIssue[] = []

  if (a < 1) {
    issues.push({
      level: 'error',
      targetControlNames: ['a'],
      message: 'Must be 1 or larger'
    })
  }

  if (b < 1) {
    issues.push({
      level: 'error',
      targetControlNames: ['b'],
      message: 'Must be 1 or larger'
    })
  }

  if (!hasUniqueElements(plaintextAlphabetChars)) {
    issues.push({
      level: 'error',
      targetControlNames: ['alphabet'],
      message: 'Must not contain duplicate characters'
    })
  }

  if (gcd(a, m) !== 1) {
    issues.push({
      level: 'error',
      targetControlNames: ['a'],
      message: 'Must be coprime to the size of the alphabet (' + m + ')'
    })
  }

  // Bail out, if there are critical issues
  if (issues.length > 0) {
    return { issues }
  }

  // Generate ciphertext alphabet from plaintext alphabet
  const ciphertextAlphabetChars = new Array(m)
  for (let i = 0; i < m; i++) {
    // Apply affine function to determine the position of a plaintext alphabet
    // letter in the ciphertext alphabet
    ciphertextAlphabetChars[i] = plaintextAlphabetChars[mod(a * i + b, m)]
  }

  const ciphertextAlphabet =
    stringFromUnicodeCodePoints(ciphertextAlphabetChars)

  // Encode or decode using simple substitution implementation
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

export default {
  contribution,
  body: {
    execute
  }
}
