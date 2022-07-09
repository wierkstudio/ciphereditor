
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { ErrorOperationIssue, OperationIssue, OperationRequest, OperationResult } from '@ciphereditor/types'
import { namedControlChangesSchema } from './control'
import { typedValueSchema } from './value'
import { z } from 'zod'

export const operationIssueSchema: z.ZodType<OperationIssue> = z.object({
  type: z.enum(['error', 'warn', 'info']),
  controlName: z.string().optional(),
  message: z.string(),
  description: z.string().optional()
})

export const errorOperationIssueSchema: z.ZodType<ErrorOperationIssue> =
  z.object({
    type: z.literal('error'),
    controlName: z.string().optional(),
    message: z.string(),
    description: z.string().optional()
  })

export const operationResultSchema: z.ZodType<OperationResult> = z.object({
  changes: namedControlChangesSchema.optional(),
  issues: z.array(operationIssueSchema).optional()
})

export const operationRequestSchema: z.ZodType<OperationRequest> = z.object({
  values: z.record(typedValueSchema),
  controlPriorities: z.array(z.string())
})

/**
 * Operation state
 */
export enum OperationState {
  /**
   * The operation is idle and ready
   */
  Ready = 'ready',

  /**
   * Operation request is currently being processed
   */
  Busy = 'busy',

  /**
   * An error occured during the last request, await manual retry
   */
  Error = 'error'
}

/**
 * Operation node
 */
export interface OperationNode extends BlueprintNode {
  /**
   * Node type
   */
  type: BlueprintNodeType.Operation

  /**
   * Operation contribution name
   */
  contributionName: string

  /**
   * Operation label
   */
  label: string

  /**
   * Operation state
   */
  state: OperationState

  /**
   * Issues occurred while processing the last operation response
   */
  issues: OperationIssue[]

  /**
   * Number identifying the current operation request
   */
  requestVersion?: number

  /**
   * Array of control node ids ordered by priority (highest to lowest)
   */
  priorityControlIds: BlueprintNodeId[]

  /**
   * Extension url
   */
  extensionUrl?: string
}
