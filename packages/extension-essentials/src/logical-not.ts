
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/logical-not',
  label: 'Logical NOT',
  description: 'Takes truth to falsity and vice versa',
  url: 'https://ciphereditor.com/operations/logical-and-or-not',
  keywords: ['boolean', 'invert', 'complement', 'negation'],
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

const execute: OperationExecuteExport = (request) => {
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

export default {
  contribution,
  body: {
    execute
  }
}
