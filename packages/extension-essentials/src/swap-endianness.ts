
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/swap-endianness',
  label: 'Swap endianness',
  description: 'Switch bit string from big-endian to little-endian or vice-versa.',
  url: 'https://ciphereditor.com/operations/swap-endianness',
  keywords: ['binary', 'bytes', 'words', 'bit', 'big-endian', 'little-endian'],
  controls: [
    {
      name: 'data',
      value: { type: 'bytes', data: 'Y2lwaGVyZWRpdG9y' },
      types: ['bytes']
    },
    {
      name: 'wordLength',
      label: 'Word byte length',
      value: 4,
      types: ['integer']
    },
    {
      name: 'padWords',
      label: 'Pad incomplete words',
      value: true,
      types: ['boolean']
    },
    {
      name: 'transformedData',
      value: { type: 'bytes', data: 'aHBpY2RlcmVyb3Rp' },
      types: ['bytes'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { controlPriorities, values } = request

  const forward =
    controlPriorities.indexOf('data') <
    controlPriorities.indexOf('transformedData')

  const wordLength = values.wordLength as number
  if (wordLength < 1) {
    return { issues: [{ level: 'error', message: 'Invalid word length' }] }
  }

  // Transformation is symmetric
  const data = (forward ? values.data : values.transformedData) as ArrayBuffer
  const outputControl = forward ? 'transformedData' : 'data'

  // Prepare padded or unpadded array of bytes and load original data into it
  const padWords = values.padWords as boolean
  const wordCount = Math.ceil(data.byteLength / wordLength)
  const byteLength = padWords ? wordCount * wordLength : data.byteLength
  const bytes = new Uint8Array(byteLength)
  bytes.set(new Uint8Array(data), 0)

  const flooredHalfWordLength = Math.floor(wordLength / 2)

  let temp, left, right
  for (let w = 0; w < wordCount; w++) {
    for (let i = 0; i < flooredHalfWordLength; i++) {
      // Calculate index from left and from right of the word
      left = w * wordLength + i
      right = w * wordLength + (wordLength - i - 1)

      // Swap bytes within word
      temp = bytes[left] ?? 0
      if (left < byteLength) {
        bytes[left] = bytes[right] ?? 0
      }
      if (right < byteLength) {
        bytes[right] = temp
      }
    }
  }

  return { changes: [{ name: outputControl, value: bytes.buffer }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
