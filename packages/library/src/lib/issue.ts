
import { Issue, issueLevels } from '../schema/issue'

/**
 * Choose the most important issue among the given ones. Returns the first issue
 * of that type (instead of all of them).
 */
export const chooseMostImportantIssue = (
  issues: Issue[]
): Issue | undefined => {
  if (issues.length === 0) {
    return undefined
  }
  let mostImportantIssue: Issue | undefined
  let mostImportantIssueLevelIndex = -1
  for (const issue of issues) {
    const issueLevelIndex = issueLevels.indexOf(issue.level)
    if (issueLevelIndex > mostImportantIssueLevelIndex) {
      mostImportantIssue = issue
      mostImportantIssueLevelIndex = issueLevelIndex
    }
  }
  return mostImportantIssue
}
