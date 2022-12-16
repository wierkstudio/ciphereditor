
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { logIssueIfUnsafeInteger } from './shared/issues'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/addition',
  label: 'Addition',
  description: 'Adds two numbers together',
  url: 'https://ciphereditor.com/explore/arithmetic-operators',
  keywords: ['add', 'addition', 'term', 'sum', 'plus', '+', 'arithmetic'],
  controls: [
    {
      name: 'termA',
      label: 'Term A',
      value: 0,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'termB',
      label: 'Term B',
      value: 0,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'sum',
      label: 'Sum A + B',
      value: 0,
      types: ['integer', 'number', 'bigint'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const termA = request.values.termA as number | bigint
  const termB = request.values.termB as number | bigint

  // When one of the operands provided is a bigint, the sum is a bigint
  const sum = typeof termA === 'bigint' || typeof termB === 'bigint'
    ? BigInt(termA) + BigInt(termB)
    : termA + termB

  // Warn if the sum has become an unsafe integer
  const issues: OperationIssue[] = []
  if (Number.isInteger(termA) && Number.isInteger(termB)) {
    logIssueIfUnsafeInteger(issues, sum, ['sum'])
  }

  return { issues, changes: [{ name: 'sum', value: sum }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
