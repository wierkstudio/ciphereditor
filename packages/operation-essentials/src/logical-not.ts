
import { Operation, OperationRequestHandler } from '@cryptii/types'

export const spec = 'https://cryptii.com/developer/extension/operation/v1'

export const operation: Operation = {
  name: 'cryptii/logical-not',
  label: 'Logical NOT',
  controls: [
    {
      name: 'a',
      initialValue: false,
      types: ['boolean']
    },
    {
      name: 'notA',
      initialValue: true,
      types: ['boolean'],
      order: 1000
    }
  ]
}

export const onOperationRequest: OperationRequestHandler = (request) => {
  const { values, controlPriorities } = request
  const forward = controlPriorities.indexOf('a') < controlPriorities.indexOf('notA')
  if (forward) {
    const a = values.a.data as boolean
    const result = !a
    return { changes: [{ name: 'notA', value: result }] }
  } else {
    const notA = values.notA.data as boolean
    const result = !notA
    return { changes: [{ name: 'a', value: result }] }
  }
}
