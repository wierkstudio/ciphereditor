
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/unicode'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/reverser',
  label: 'Reverser',
  description: 'Reverse (or flip) characters or bytes',
  keywords: ['flip'],
  controls: [
    {
      name: 'data',
      value: 'ciphereditor',
      types: ['text', 'bytes']
    },
    {
      name: 'transformedData',
      value: 'rotiderehpic',
      types: ['text', 'bytes'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { controlPriorities, values } = request
  const forward =
    controlPriorities.indexOf('data') <
    controlPriorities.indexOf('transformedData')
  const data = forward
    ? values.data as string | ArrayBuffer
    : values.transformedData as string | ArrayBuffer
  const outputControl = forward ? 'transformedData' : 'data'
  if (typeof data === 'string') {
    const reverseCodePoints = stringToUnicodeCodePoints(data).reverse()
    const value = stringFromUnicodeCodePoints(reverseCodePoints)
    return { changes: [{ name: outputControl, value }] }
  } else {
    const value = new Uint8Array(data).slice().reverse().buffer
    return { changes: [{ name: outputControl, value }] }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
