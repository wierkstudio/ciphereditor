
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/logical-or',
  label: 'Logical OR',
  description: 'Output true if and only if one or more of its operands is true',
  url: 'https://ciphereditor.com/operations/logical-and-or-not',
  keywords: ['boolean'],
  controls: [
    {
      name: 'a',
      label: 'A',
      initialValue: false,
      types: ['boolean']
    },
    {
      name: 'b',
      label: 'B',
      initialValue: false,
      types: ['boolean']
    },
    {
      name: 'aOrB',
      label: 'A OR B',
      initialValue: false,
      types: ['boolean'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const a = request.values.a.data as boolean
  const b = request.values.b.data as boolean
  const result = a || b
  return { changes: [{ name: 'aOrB', value: result }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
