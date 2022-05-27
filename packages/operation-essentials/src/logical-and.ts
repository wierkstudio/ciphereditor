
import { Operation, OperationRequestHandler } from '@cryptii/types'

export const spec = 'https://cryptii.com/developer/extension/operation/v1'

export const operation: Operation = {
  name: 'cryptii/logical-and',
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

export const onOperationRequest: OperationRequestHandler = (request) => {
  const a = request.values.a.data as boolean
  const b = request.values.b.data as boolean
  const result = a && b
  return { changes: [{ name: 'aOrB', value: result }] }
}
