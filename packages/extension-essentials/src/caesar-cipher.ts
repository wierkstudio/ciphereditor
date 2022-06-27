
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'
import { mod } from './lib/math'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/string'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/caesar-cipher',
  label: 'Caesar cipher',
  controls: [
    {
      name: 'plaintext',
      initialValue: 'The quick brown fox jumps over the lazy dog.',
      types: ['text']
    },
    {
      name: 'shift',
      initialValue: 7,
      types: ['integer']
    },
    {
      name: 'alphabet',
      initialValue: 'abcdefghijklmnopqrstuvwxyz',
      types: ['text']
      // TODO: Unique characters
      // TODO: Min length 2
      // TODO: Case sensitivity
    },
    {
      name: 'caseStrategy',
      initialValue: 'maintain',
      types: ['text'],
      choices: [
        { value: 'maintain', label: 'Maintain case' },
        { value: 'ignore', label: 'Ignore case' },
        { value: 'strict', label: 'Strict (A ≠ a)' }
      ]
    },
    {
      name: 'foreignStrategy',
      initialValue: 'maintain',
      types: ['text'],
      choices: [
        { value: 'maintain', label: 'Maintain foreign chars' },
        { value: 'ignore', label: 'Ignore foreign chars' }
      ]
    },
    {
      name: 'ciphertext',
      initialValue: 'Aol xbpjr iyvdu mve qbtwz vcly aol shgf kvn.',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request

  const caseStrategy = values.caseStrategy.data as string
  const foreignStrategy = values.foreignStrategy.data as string
  const shift = values.shift.data as number

  const forward = controlPriorities.indexOf('plaintext') < controlPriorities.indexOf('ciphertext')
  const inputControl = forward ? 'plaintext' : 'ciphertext'

  const input = values[inputControl].data as string
  const inputCodePoints = stringToUnicodeCodePoints(input)

  const maintainForeignCharacters = foreignStrategy === 'maintain'

  // Prepare alphabet(s) depending on chosen case strategy
  let alphabet = values.alphabet.data as string
  let uppercaseAlphabet = ''
  if (caseStrategy !== 'strict') {
    alphabet = alphabet.toLowerCase()
    uppercaseAlphabet = alphabet.toUpperCase()
  }

  const alphabetCodePoints = stringToUnicodeCodePoints(alphabet)
  const uppercaseAlphabetCodePoints = stringToUnicodeCodePoints(uppercaseAlphabet)

  const m = alphabetCodePoints.length
  const n = inputCodePoints.length
  const result = new Array(n)

  let codePoint, x, y, uppercase
  let j = 0

  // Go through each character in content
  for (let i = 0; i < n; i++) {
    codePoint = inputCodePoints[i]

    // Match alphabet character
    x = alphabetCodePoints.indexOf(codePoint)
    uppercase = false

    // Match uppercase alphabet character (depending on case strategy)
    if (x === -1 && caseStrategy !== 'strict') {
      x = uppercaseAlphabetCodePoints.indexOf(codePoint)
      uppercase = true
    }

    if (x === -1) {
      // Character is not in the alphabet
      if (maintainForeignCharacters) {
        result[j++] = codePoint
      }
    } else {
      // Shift character
      y = mod(x + shift * (forward ? 1 : -1), m)

      // Translate index to character following the case strategy
      if (caseStrategy === 'maintain' && uppercase) {
        result[j++] = uppercaseAlphabetCodePoints[y]
      } else {
        result[j++] = alphabetCodePoints[y]
      }
    }
  }

  const resultCodePoints = result.slice(0, j)
  const outputControl = forward ? 'ciphertext' : 'plaintext'
  const output = stringFromUnicodeCodePoints(resultCodePoints)

  return { changes: [{ name: outputControl, value: output }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
