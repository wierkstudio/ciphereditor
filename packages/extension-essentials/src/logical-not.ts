
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/logical-not',
  label: 'Logical NOT',
  description: 'Takes truth to falsity and vice versa',
  url: 'https://ciphereditor.com/explore/logical-and-or-not',
  keywords: ['boolean', 'invert', 'complement', 'negation'],
  controls: [
    {
      name: 'a',
      label: 'A',
      value: false,
      types: ['boolean']
    },
    {
      name: 'notA',
      label: 'NOT A',
      value: true,
      types: ['boolean'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request
  const forward = controlPriorities.indexOf('a') < controlPriorities.indexOf('notA')
  if (forward) {
    const a = values.a as boolean
    const result = !a
    return { changes: [{ name: 'notA', value: result }] }
  } else {
    const notA = values.notA as boolean
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
