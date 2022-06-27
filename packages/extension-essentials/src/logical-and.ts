
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/logical-and',
  label: 'Logical AND',
  controls: [
    {
      name: 'a',
      initialValue: false,
      types: ['boolean']
    },
    {
      name: 'b',
      initialValue: false,
      types: ['boolean']
    },
    {
      name: 'aAndB',
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
  const result = a && b
  return { changes: [{ name: 'aOrB', value: result }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
