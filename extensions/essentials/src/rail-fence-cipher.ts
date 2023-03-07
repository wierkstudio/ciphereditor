
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/unicode'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/rail-fence-cipher',
  label: 'Rail fence cipher',
  description: 'Rail fence cipher lays out characters in a zigzag pattern across a number of “rails” and reads them off row by row.',
  url: 'https://ciphereditor.com/explore/rail-fence-cipher',
  keywords: ['transposition cipher', 'zigzag cipher'],
  controls: [
    {
      name: 'plaintext',
      value: 'wearediscoveredrunatonce',
      types: ['text']
    },
    {
      name: 'rails',
      value: 3,
      types: ['integer']
    },
    {
      name: 'offset',
      value: 0,
      types: ['integer']
    },
    {
      name: 'ciphertext',
      value: 'wecruoerdsoeerntneaivdac',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request
  const rails = values.rails as number
  const offset = values.offset as number

  if (rails < 2) {
    return {
      issues: [{
        level: 'error',
        message: 'Must be 2 or larger',
        targetControlNames: ['rails']
      }]
    }
  }

  if (offset < 0) {
    return {
      issues: [{
        level: 'error',
        message: 'Must be positive',
        targetControlNames: ['offset']
      }]
    }
  }

  const encode =
    controlPriorities.indexOf('plaintext') <
    controlPriorities.indexOf('ciphertext')

  // Cycle after which fence matrix repeats
  const cycle = rails * 2 - 2

  // X ->
  // Y W       E       C       R       U       O
  // |   E   R   D   S   O   E   E   R   N   T   N   E
  // V     A       I       V       D       A       C
  let x, y

  if (encode) {
    const plaintext = stringToUnicodeCodePoints(values.plaintext as string)
    const length = plaintext.length

    // Prepare an empty array of characters for each row
    const railCharacters: number[][] = new Array(rails)
    for (let y = 0; y < rails; y++) {
      railCharacters[y] = []
    }

    // Go through plaintext characters
    for (x = 0; x < length; x++) {
      // Calculate at what y position the fence is for the current x position
      y = rails - 1 - Math.abs(cycle / 2 - (x + offset) % cycle)
      // Append the the current plaintext character to the respective fence row
      railCharacters[y].push(plaintext[x])
    }

    // Read fence off row by row
    const ciphertext = stringFromUnicodeCodePoints(railCharacters.flat())
    return { changes: [{ name: 'ciphertext', value: ciphertext }] }
  } else {
    const ciphertext = stringToUnicodeCodePoints(values.ciphertext as string)
    const length = ciphertext.length

    // Create result array of code points
    const plaintextCodePoints = new Array(length)

    // Go through virtual matrix rails (y) and cols (x)
    let j = 0
    for (y = 0; y < rails; y++) {
      for (x = 0; x < length; x++) {
        // Check if the current x-y-position is situated on the zigzag fence
        if ((y + x + offset) % cycle === 0 || (y - x - offset) % cycle === 0) {
          // Set resulting character for the current x-position
          plaintextCodePoints[x] = ciphertext[j++]
        }
      }
    }

    const plaintext = stringFromUnicodeCodePoints(plaintextCodePoints)
    return { changes: [{ name: 'plaintext', value: plaintext }] }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
