
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/logical-and',
  label: 'Logical AND',
  description: 'Output true if and only if all the operands are true',
  url: 'https://ciphereditor.com/explore/logical-and-or-not',
  keywords: ['boolean'],
  controls: [
    {
      name: 'a',
      label: 'A',
      value: false,
      types: ['boolean']
    },
    {
      name: 'b',
      label: 'B',
      value: false,
      types: ['boolean']
    },
    {
      name: 'aAndB',
      label: 'A AND B',
      value: false,
      types: ['boolean'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const a = request.values.a as boolean
  const b = request.values.b as boolean
  const result = a && b
  return { changes: [{ name: 'aAndB', value: result }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
