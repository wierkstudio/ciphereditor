
import z from 'zod'

/**
 * Issue levels ordered by priority (from low to high)
 */
export const issueLevels = ['info', 'warn', 'error'] as const

/**
 * Information about error, warning or other events that occur e.g. during
 * operation execution.
 */
export type Issue = z.infer<typeof issueSchema>
export const issueSchema = z.object({
  /**
   * Issue level
   */
  level: z.enum(issueLevels),

  /**
   * Issue message
   */
  message: z.string(),

  /**
   * Secondary issue description
   */
  description: z.string().optional()
})

export type OperationIssue = z.infer<typeof operationIssueSchema>
export const operationIssueSchema = issueSchema.extend({
  targetControlNames: z.array(z.string()).optional()
})

export type ErrorOperationIssue = z.infer<typeof errorOperationIssueSchema>
export const errorOperationIssueSchema = issueSchema.extend({
  type: z.literal('error')
})
