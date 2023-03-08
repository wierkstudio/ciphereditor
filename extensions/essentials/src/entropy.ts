
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { stringToUnicodeCodePoints } from './lib/unicode'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/entropy',
  label: 'Entropy',
  description: 'Shannon Entropy measures the predictability of a data source. It can be used to detect whether data is likely to be structured or unstructured.',
  url: 'https://ciphereditor.com/explore/shannon-entropy',
  keywords: ['shannon', 'information theory', 'frequency', 'analysis'],
  controls: [
    {
      name: 'data',
      value: 'the quick brown fox jumps over the lazy dog',
      types: ['text', 'bytes']
    },
    {
      name: 'base',
      value: 2,
      types: ['number', 'integer'],
      options: [
        {
          value: 2,
          label: 'Base 2 (bits)'
        },
        {
          value: Math.E,
          label: 'Base e (nats)'
        },
        {
          value: 10,
          label: 'Base 10 (dits)'
        }
      ],
      enforceOptions: false
    },
    {
      name: 'entropy',
      value: 4.385453417442482,
      types: ['number', 'integer'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const data = request.values.data as string | ArrayBuffer
  const base = request.values.base as number

  if (base < 0) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['base'],
        message: 'Must be a positive number'
      }]
    }
  }

  // Use Unicode code points for text and byte values for binary data
  const values = typeof data === 'string'
    ? stringToUnicodeCodePoints(data)
    : Array.from(new Uint8Array(data))

  // Count appearances for each unique value
  const valueAppearances = new Map<number, number>()
  for (const value of values) {
    valueAppearances.set(value, (valueAppearances.get(value) ?? 0) + 1)
  }

  // Sum up entropy for each unique value
  const n = values.length
  let p
  let entropy = 0
  for (const appearances of valueAppearances.values()) {
    p = appearances / n
    entropy -= p * (Math.log(p) / Math.log(base))
  }

  return { changes: [{ name: 'entropy', value: entropy }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
