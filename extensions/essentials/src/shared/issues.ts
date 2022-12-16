
import { OperationIssue, Value } from '@ciphereditor/library'

export const logIssueIfUnsafeInteger = (
  issues: OperationIssue[],
  value: Value,
  targetControlNames?: string[]
): void => {
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    issues.push({
      level: 'warn',
      message: 'This value is not a safe integer',
      description:
        'This integer cannot be exactly represented as an IEEE-754 double ' +
        'precision number. Consider using the BigInt type.',
      targetControlNames
    })
  }
}
