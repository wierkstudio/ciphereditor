
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/string'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/rot13',
  label: 'ROT13',
  description: 'Method in which each letter in a text is rotated by 13 places.',
  url: 'https://ciphereditor.com/operations/rot13',
  keywords: ['substitution', 'cipher', 'shift'],
  controls: [
    {
      name: 'plaintext',
      value: 'The quick brown fox jumps over the lazy dog.',
      types: ['text']
    },
    {
      name: 'variant',
      value: 'rot13',
      types: ['text'],
      options: [
        { value: 'rot5', label: 'ROT5 (0-9)' },
        { value: 'rot13', label: 'ROT13 (A-Z, a-z)' },
        { value: 'rot18', label: 'ROT18 (0-9, A-Z, a-z)' },
        { value: 'rot47', label: 'ROT47 (!-~)' }
      ]
    },
    {
      name: 'ciphertext',
      value: 'Gur dhvpx oebja sbk whzcf bire gur ynml qbt.',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request
  const variant = values.variant as 'rot5' | 'rot13' | 'rot18' | 'rot47'
  const forward = controlPriorities.indexOf('plaintext') < controlPriorities.indexOf('ciphertext')
  const string = (forward ? values.plaintext : values.ciphertext) as string

  const codePoints = stringToUnicodeCodePoints(string)
  const ouputCodePoints = codePoints.map(codePoint => {
    // Rotate numbers 0-9
    if (variant === 'rot5' || variant === 'rot18') {
      codePoint = rotateCodePoint(codePoint, 48, 57)
    }

    // Rotate lowercase letters a-z, A-Z
    if (variant === 'rot13' || variant === 'rot18') {
      codePoint = rotateCodePoint(codePoint, 97, 122)
      codePoint = rotateCodePoint(codePoint, 65, 90)
    }

    // Rotate characters !-~
    if (variant === 'rot47') {
      codePoint = rotateCodePoint(codePoint, 33, 126)
    }
    return codePoint
  })

  const outputString = stringFromUnicodeCodePoints(ouputCodePoints)
  const outputControl = forward ? 'ciphertext' : 'plaintext'

  return { changes: [{ name: outputControl, value: outputString }] }
}

/**
 * Rotate a code point within the given bounds.
 */
const rotateCodePoint = (codePoint: number, start: number, end: number): number => {
  if (codePoint >= start && codePoint <= end) {
    const count = end - start + 1
    codePoint += count / 2

    if (codePoint > end) {
      codePoint -= count
    }
  }
  return codePoint
}

export default {
  contribution,
  body: {
    execute
  }
}
