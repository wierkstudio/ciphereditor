
import { OperationIssue } from '@app-types'

const typeOrder: Array<OperationIssue['type']> = ['info', 'warn', 'error']

const useHighestIssueType = (issues: OperationIssue[]): OperationIssue['type'] | undefined => {
  if (issues.length === 0) {
    return undefined
  }
  let typeIndex = 0
  for (const issue of issues) {
    typeIndex = Math.max(typeIndex, typeOrder.indexOf(issue.type))
  }
  return typeOrder[typeIndex]
}

export default useHighestIssueType
