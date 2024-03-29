
import { Contribution, ControlChange, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { alphabetTextChoices } from './shared/options'
import { hasUniqueElements } from './lib/array'
import { mod } from './lib/math'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/unicode'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/vigenere-cipher',
  label: 'Vigenère cipher',
  description: 'Method in which each letter in a text is replaced by a letter a number of places down the alphabet dependent on a provided key.',
  url: 'https://ciphereditor.com/explore/vigenere-cipher',
  keywords: ['substitution cipher', 'shift', 'vigenere', 'key', 'beaufort', 'trithemius'],
  controls: [
    {
      name: 'plaintext',
      value: 'The quick brown fox jumps over the lazy dog.',
      types: ['text']
    },
    {
      name: 'variant',
      value: 'vigenere',
      types: ['text'],
      options: [
        {
          value: 'vigenere',
          label: 'Vigenère cipher'
        },
        {
          value: 'beaufort',
          label: 'Beaufort cipher'
        },
        {
          value: 'variantBeaufort',
          label: 'Variant Beaufort cipher'
        },
        {
          value: 'trithemius',
          label: 'Trithemius cipher'
        }
      ]
    },
    {
      name: 'key',
      value: 'ciphereditor',
      types: ['text']
    },
    {
      name: 'keyMode',
      value: 'repeat',
      types: ['text'],
      options: [
        { value: 'repeat', label: 'Repeat' },
        { value: 'autoKey', label: 'Auto-key' }
      ]
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
      value: 'Vpt xyzgn jkcnp nde nlqsa hjvt bwl prdb lhu.',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request
  const changes: ControlChange[] = []
  const issues: OperationIssue[] = []

  const forward = controlPriorities.indexOf('plaintext') < controlPriorities.indexOf('ciphertext')
  const inputControl = forward ? 'plaintext' : 'ciphertext'

  const input = values[inputControl] as string
  const inputCodePoints = stringToUnicodeCodePoints(input)

  // Prepare alphabet
  const alphabet = (values.alphabet as string).toLowerCase()
  const alphabetCodePoints = stringToUnicodeCodePoints(alphabet)

  // Validate alphabet
  if (alphabetCodePoints.length <= 1) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['alphabet'],
        message: 'The alphabet must have a size of 2 characters or more'
      }]
    }
  }

  if (!hasUniqueElements(alphabetCodePoints)) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['alphabet'],
        message: 'The alphabet must not contain duplicate characters'
      }]
    }
  }

  // Prepare uppercase alphabet
  const uppercaseAlphabetCodePoints = stringToUnicodeCodePoints(alphabet.toUpperCase())

  // Prepare key
  let keyMode = values.keyMode as string
  let key = (values.key as string).toLowerCase()
  // Correct for variants
  const variant = values.variant as string
  if (variant === 'trithemius') {
    // TODO: Disable the key and key mode controls.
    key = alphabet
    keyMode = 'repeat'
  }
  const keyCodePoints = stringToUnicodeCodePoints(key)

  // Validate key
  if (keyCodePoints.length === 0) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['key'],
        message: 'The key must have a size of 1 character or more'
      }]
    }
  }

  if (!keyCodePoints.every(codePoint => alphabetCodePoints.includes(codePoint))) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['key'],
        message: 'The key must only contain characters from the alphabet'
      }]
    }
  }

  const m = alphabetCodePoints.length
  const n = inputCodePoints.length
  const result = new Array(n)

  let codePoint, x, y, uppercase
  let j = 0
  let k = 0

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
      // Shift character depending on variant
      const keyCodePoint = keyCodePoints[k++]
      const shift = alphabetCodePoints.indexOf(keyCodePoint)
      switch (variant) {
        case 'beaufort':
          y = shift - x
          break
        case 'variantBeaufort':
          y = forward
            ? x - shift
            : x + shift
          break
        default:
          y = forward
            ? x + shift
            : x - shift
      }
      y = mod(y, m)

      // Translate index to character following the case strategy
      if (uppercase) {
        result[j++] = uppercaseAlphabetCodePoints[y]
      } else {
        result[j++] = alphabetCodePoints[y]
      }

      // Extend key according to given method
      switch (keyMode) {
        case 'autoKey':
          // Encoding uses input, decoding uses output
          keyCodePoints.push(alphabetCodePoints[forward ? x : y])
          break

        case 'repeat':
          keyCodePoints.push(keyCodePoint)
          break
      }
    }
  }

  // Key-index not incremented implies no characters appear in the alphabet
  if (k === 0) {
    issues.push({
      level: 'warn',
      targetControlNames: [inputControl],
      message: 'None of the characters are part of the alphabet and they all get ignored'
    })
  }

  const resultCodePoints = result.slice(0, j)
  const outputControl = forward ? 'ciphertext' : 'plaintext'
  const output = stringFromUnicodeCodePoints(resultCodePoints)
  changes.push({ name: outputControl, value: output })

  return { changes, issues }
}

export default {
  contribution,
  body: {
    execute
  }
}
