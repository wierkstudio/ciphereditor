
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { logIssueIfUnsafeInteger } from './shared/issues'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/multiplication',
  label: 'Multiplication',
  description: 'Multiplies two numbers together',
  url: 'https://ciphereditor.com/explore/arithmetic-operators',
  keywords: ['multiply', 'factor', 'product', 'times', '*', 'arithmetic'],
  controls: [
    {
      name: 'factor1',
      label: 'Factor 1',
      value: 1,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'factor2',
      label: 'Factor 2',
      value: 1,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'product',
      value: 1,
      types: ['integer', 'number', 'bigint'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const factor1 = request.values.factor1 as number | bigint
  const factor2 = request.values.factor2 as number | bigint

  // When one of the operands provided is a bigint, the product is a bigint
  const product = typeof factor1 === 'bigint' || typeof factor2 === 'bigint'
    ? BigInt(factor1) * BigInt(factor2)
    : factor1 * factor2

  // Warn if the product has become an unsafe integer
  const issues: OperationIssue[] = []
  if (Number.isInteger(factor1) && Number.isInteger(factor2)) {
    logIssueIfUnsafeInteger(issues, product, ['product'])
  }

  return { issues, changes: [{ name: 'product', value: product }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
