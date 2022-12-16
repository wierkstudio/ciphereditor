
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
      name: 'difference',
      label: 'Difference A - B',
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

  // When one of the operands provided is a bigint, the difference is a bigint
  const difference = typeof termA === 'bigint' || typeof termB === 'bigint'
    ? BigInt(termA) - BigInt(termB)
    : termA - termB

  // Warn if the difference has become an unsafe integer
  const issues: OperationIssue[] = []
  if (Number.isInteger(termA) && Number.isInteger(termB)) {
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
