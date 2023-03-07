
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { alphabetTextChoices } from './shared/options'
import { hasUniqueElements } from './lib/array'
import { mod } from './lib/math'
import { simpleSubstitutionEncode } from './simple-substitution'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/unicode'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/caesar-cipher',
  label: 'Caesar cipher',
  description: 'Method in which each letter in a text is replaced by a letter a fixed number of places down the alphabet.',
  url: 'https://ciphereditor.com/explore/caesar-cipher',
  keywords: ['substitution', 'shift', 'julius'],
  controls: [
    {
      name: 'plaintext',
      value: 'the quick brown fox jumps over the lazy dog',
      types: ['text']
    },
    {
      name: 'shift',
      value: 3,
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
      value: 'wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request

  const shift = values.shift as number

  const encode =
    controlPriorities.indexOf('plaintext') <
    controlPriorities.indexOf('ciphertext')

  const plaintextAlphabet = values.alphabet as string
  const plaintextAlphabetChars = stringToUnicodeCodePoints(plaintextAlphabet)

  // Validate input
  const issues: OperationIssue[] = []

  if (plaintextAlphabetChars.length <= 1) {
    issues.push({
      level: 'error',
      targetControlNames: ['alphabet'],
      message: 'The alphabet must have a size of 2 characters or more'
    })
  }

  if (!hasUniqueElements(plaintextAlphabetChars)) {
    issues.push({
      level: 'error',
      targetControlNames: ['alphabet'],
      message: 'The alphabet must not contain duplicate characters'
    })
  }

  // Bail out, if the input is not valid
  if (issues.length > 0) {
    return { issues }
  }

  // Shift the alphabet to form the ciphertext alphabet
  const alphabetShift = mod(shift, plaintextAlphabetChars.length)
  const ciphertextAlphabetChars =
    plaintextAlphabetChars.slice(alphabetShift)
      .concat(plaintextAlphabetChars.slice(0, alphabetShift))
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
