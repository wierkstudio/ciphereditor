
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/operation-essentials/logical-or',
  label: 'Logical OR',
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
      name: 'aOrB',
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
