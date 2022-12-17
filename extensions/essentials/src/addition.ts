
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
      name: 'term1',
      label: 'Term 1',
      value: 0,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'term2',
      label: 'Term 2',
      value: 0,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'sum',
      value: 0,
      types: ['integer', 'number', 'bigint'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const term1 = request.values.term1 as number | bigint
  const term2 = request.values.term2 as number | bigint

  // When one of the operands provided is a bigint, the sum is a bigint
  const sum = typeof term1 === 'bigint' || typeof term2 === 'bigint'
    ? BigInt(term1) + BigInt(term2)
    : term1 + term2

  // Warn if the sum has become an unsafe integer
  const issues: OperationIssue[] = []
  if (Number.isInteger(term1) && Number.isInteger(term2)) {
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
