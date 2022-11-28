
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { swapBufferEndianness } from './lib/binary'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/swap-endianness',
  label: 'Swap endianness',
  description: 'Switch bit string from big-endian to little-endian or vice-versa.',
  url: 'https://ciphereditor.com/explore/swap-endianness',
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

  const data = (forward ? values.data : values.transformedData) as ArrayBuffer

  const wordLength = values.wordLength as number
  if (wordLength < 1) {
    return { issues: [{ level: 'error', message: 'Invalid word length' }] }
  }

  const padWords = values.padWords as boolean
  const value = swapBufferEndianness(data, wordLength, padWords)
  return { changes: [{ name: forward ? 'transformedData' : 'data', value }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
