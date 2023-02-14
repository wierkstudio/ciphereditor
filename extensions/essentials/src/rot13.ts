
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/string'
import { simpleSubstitutionEncode } from './simple-substitution'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/rot13',
  label: 'ROT13',
  description: 'Method in which each letter in a text is rotated by 13 places.',
  url: 'https://ciphereditor.com/explore/rot13',
  keywords: ['substitution', 'cipher', 'shift', 'rot5', 'rot18', 'rot47', 'rot8000'],
  controls: [
    {
      name: 'plaintext',
      value: 'the quick brown fox jumps over the lazy dog',
      types: ['text']
    },
    {
      name: 'variant',
      value: 'rot13',
      types: ['text'],
      options: [
        { value: 'rot5', label: 'ROT5 (0-9)' },
        { value: 'rot13', label: 'ROT13 (A-Z)' },
        { value: 'rot18', label: 'ROT18 (0-9, A-Z)' },
        { value: 'rot47', label: 'ROT47 (!-~)' },
        { value: 'rot8000', label: 'ROT8000' }
      ]
    },
    {
      name: 'ciphertext',
      value: 'gur dhvpx oebja sbk whzcf bire gur ynml qbt',
      types: ['text'],
      order: 1000
    }
  ]
}

const rot47A = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNO'
const rot47B = 'PQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request

  const variant = values.variant as string
  const encode =
    controlPriorities.indexOf('plaintext') <
    controlPriorities.indexOf('ciphertext')

  const inputString = (encode ? values.plaintext : values.ciphertext) as string

  let outputString
  switch (variant) {
    case 'rot5': {
      outputString = simpleSubstitutionEncode(
        inputString,
        '0123456789',
        '5678901234'
      )
      break
    }
    case 'rot13': {
      outputString = simpleSubstitutionEncode(
        inputString,
        'abcdefghijklmnopqrstuvwxyz',
        'nopqrstuvwxyzabcdefghijklm'
      )
      break
    }
    case 'rot18': {
      outputString = simpleSubstitutionEncode(
        inputString,
        'abcdefghijklmnopqrstuvwxyz0123456789',
        'nopqrstuvwxyzabcdefghijklm5678901234'
      )
      break
    }
    case 'rot47': {
      outputString = simpleSubstitutionEncode(
        inputString,
        rot47A + rot47B,
        rot47B + rot47A
      )
      break
    }
    case 'rot8000': {
      outputString = rot8000Encode(inputString)
      break
    }
    default: {
      outputString = inputString
    }
  }

  const outputControl = encode ? 'ciphertext' : 'plaintext'
  return { changes: [{ name: outputControl, value: outputString }] }
}

/**
 * Valid Unicode code point ranges, each with start (incl.) and end (excl.).
 * @see https://github.com/rottytooth/rot8000/blob/eb7d0a7c6b3990a141777f72251a18a2fbdba667/rot8000.js#L6-L7
 */
const rot8000Ranges = [
  { start: 33, end: 127 },
  { start: 161, end: 5760 },
  { start: 5761, end: 8192 },
  { start: 8203, end: 8232 },
  { start: 8234, end: 8239 },
  { start: 8240, end: 8287 },
  { start: 8288, end: 12288 },
  { start: 12289, end: 55296 },
  { start: 57344, end: 65536 }
]

/**
 * The ROT8000 shift is half the number of valid code points (see
 * `rot8000Ranges`) in the Unicode BMP. It is hardcoded for performance reasons.
 */
const rot8000Shift = 31_702

/**
 * Encode the given plaintext using the ROT8000 variant. Foreign characters are
 * maintained. This function is its own inverse.
 *
 * We are using a more memory efficient algorithm than the one implemented in
 * the original ROT8000 repository at https://github.com/rottytooth/rot8000.
 * However, this may require more computing power for longer messages.
 */
const rot8000Encode = (string: string): string => {
  const chars = stringToUnicodeCodePoints(string)

  let char, range, shiftRemainder, rangeRemainder
  for (let i = 0; i < chars.length; i++) {
    char = chars[i]

    // Ignore chars outside of BMP
    if (char >= rot8000Ranges[rot8000Ranges.length - 1].end) {
      continue
    }

    // Find the last range that matches the upper bound
    range = 0
    while (char > rot8000Ranges[range].end) {
      range++
    }

    // If the char is smaller than the lower bound it lies in between valid
    // char ranges and is thus a foreign char to be ignored
    if (char < rot8000Ranges[range].start) {
      continue
    }

    // Shift the character by the ROT8000 shift within valid chars and skipping
    // invalid chars
    shiftRemainder = rot8000Shift
    while (shiftRemainder > 0) {
      rangeRemainder = rot8000Ranges[range].end - char
      if (shiftRemainder >= rangeRemainder) {
        shiftRemainder -= rangeRemainder
        range = (range + 1) % rot8000Ranges.length
        char = rot8000Ranges[range].start
      } else {
        char += shiftRemainder
        shiftRemainder = 0
      }
    }

    // Set encoded char in-place
    chars[i] = char
  }

  return stringFromUnicodeCodePoints(chars)
}

export default {
  contribution,
  body: {
    execute
  }
}
