
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
      name: 'factorA',
      label: 'Factor A',
      value: 1,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'factorB',
      label: 'Factor B',
      value: 1,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'product',
      label: 'Product A × B',
      value: 1,
      types: ['integer', 'number', 'bigint'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const factorA = request.values.factorA as number | bigint
  const factorB = request.values.factorB as number | bigint

  // When one of the operands provided is a bigint, the product is a bigint
  const product = typeof factorA === 'bigint' || typeof factorB === 'bigint'
    ? BigInt(factorA) * BigInt(factorB)
    : factorA * factorB

  // Warn if the product has become an unsafe integer
  const issues: OperationIssue[] = []
  if (Number.isInteger(factorA) && Number.isInteger(factorB)) {
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
