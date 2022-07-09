
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'
import { hasUniqueElements } from './lib/array'
import { mod } from './lib/math'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/string'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/caesar-cipher',
  label: 'Caesar cipher',
  description: 'Method in which each letter in a text is replaced by a letter a fixed number of places down the alphabet.',
  url: 'https://ciphereditor.com/operations/caesar-cipher',
  keywords: ['substitution', 'cipher', 'shift', 'julius'],
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

  const shift = values.shift.data as number

  const forward = controlPriorities.indexOf('plaintext') < controlPriorities.indexOf('ciphertext')
  const inputControl = forward ? 'plaintext' : 'ciphertext'

  const input = values[inputControl].data as string
  const inputCodePoints = stringToUnicodeCodePoints(input)

  // Prepare alphabet
  const alphabet = (values.alphabet.data as string).toLowerCase()
  const alphabetCodePoints = stringToUnicodeCodePoints(alphabet)

  // Validate alphabet
  if (alphabetCodePoints.length <= 1) {
    return {
      type: 'error',
      controlName: 'alphabet',
      message: 'The alphabet must have a size of 2 characters or more'
    }
  }

  if (!hasUniqueElements(alphabetCodePoints)) {
    return {
      type: 'error',
      controlName: 'alphabet',
      message: 'The alphabet must not contain duplicate characters'
    }
  }

  // Prepare uppercase alphabet
  const uppercaseAlphabetCodePoints = stringToUnicodeCodePoints(alphabet.toUpperCase())

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
    if (x === -1) {
      x = uppercaseAlphabetCodePoints.indexOf(codePoint)
      uppercase = true
    }

    if (x === -1) {
      // Character is not in the alphabet
      result[j++] = codePoint
    } else {
      // Shift character
      y = mod(x + shift * (forward ? 1 : -1), m)

      // Translate index to character following the case strategy
      if (uppercase) {
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
