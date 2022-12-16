
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { logIssueIfUnsafeInteger } from './shared/issues'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/division',
  label: 'Division',
  description: 'Divides one number by another',
  url: 'https://ciphereditor.com/explore/arithmetic-operators',
  keywords: ['dividend', 'divisor', 'quotient', 'integer', '/', 'mod', 'remainder', '%', 'arithmetic'],
  controls: [
    {
      name: 'dividend',
      label: 'Dividend A',
      value: 1,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'divisor',
      label: 'Divisor B',
      value: 1,
      types: ['integer', 'number', 'bigint']
    },
    {
      name: 'quotient',
      label: 'Quotient A ÷ B',
      value: 1,
      types: ['integer', 'number', 'bigint'],
      writable: false,
      order: 1000
    },
    {
      name: 'integerQuotient',
      label: 'Integer quotient ⌊A ÷ B⌋',
      value: 1,
      types: ['integer', 'bigint'],
      writable: false,
      order: 1000
    },
    {
      name: 'remainder',
      label: 'Remainder A mod B',
      value: 0,
      types: ['integer', 'bigint'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const dividend = request.values.dividend as number | bigint
  const divisor = request.values.divisor as number | bigint

  // When one of the operands provided is a bigint, the quotient and remainder
  // are returned as bigint
  const useBigInt = typeof dividend === 'bigint' || typeof divisor === 'bigint'

  const quotient = useBigInt
    ? BigInt(dividend) / BigInt(divisor)
    : dividend / divisor
  const integerQuotient = useBigInt
    ? BigInt(dividend) / BigInt(divisor)
    : Math.floor(dividend / divisor)
  const remainder = useBigInt
    ? BigInt(dividend) % BigInt(divisor)
    : dividend % divisor

  // Warn if the quotient has become an unsafe integer
  const issues: OperationIssue[] = []
  if (typeof quotient === 'number' && Number.isInteger(quotient)) {
    logIssueIfUnsafeInteger(issues, quotient, ['quotient'])
  }
  if (typeof integerQuotient === 'number' && Number.isInteger(integerQuotient)) {
    logIssueIfUnsafeInteger(issues, integerQuotient, ['integerQuotient'])
  }
  if (typeof remainder === 'number' && Number.isInteger(remainder)) {
    logIssueIfUnsafeInteger(issues, remainder, ['remainder'])
  }

  const changes = [
    { name: 'quotient', value: quotient },
    { name: 'integerQuotient', value: integerQuotient },
    { name: 'remainder', value: remainder }
  ]

  return { changes, issues }
}

export default {
  contribution,
  body: {
    execute
  }
}
