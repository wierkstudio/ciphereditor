
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { logIssueIfUnsafeInteger } from './shared/issues'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/subtraction',
  label: 'Subtraction',
  description: 'Subtracts one number from another',
  url: 'https://ciphereditor.com/explore/arithmetic-operators',
  keywords: ['sub', 'difference', 'minus', '-', 'arithmetic'],
  controls: [
    {
      name: 'term1',
      label: 'First Term',
      value: 0,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'term2',
      label: 'Second Term',
      value: 0,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'difference',
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

  // When one of the operands provided is a bigint, the difference is a bigint
  const difference = typeof term1 === 'bigint' || typeof term2 === 'bigint'
    ? BigInt(term1) - BigInt(term2)
    : term1 - term2

  // Warn if the difference has become an unsafe integer
  const issues: OperationIssue[] = []
  if (Number.isInteger(term1) && Number.isInteger(term2)) {
    logIssueIfUnsafeInteger(issues, difference, ['difference'])
  }

  return { issues, changes: [{ name: 'difference', value: difference }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
