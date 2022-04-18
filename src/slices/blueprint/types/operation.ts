
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { controlSchema, namedControlChangesSchema } from './control'
import { z } from 'zod'
import { TypedValue } from './value'

export const operationSchema = z.object({
  /**
   * Unique operation entity name
   */
  name: z.string(),

  /**
   * Operation label
   */
  label: z.string(),

  /**
   * Array of control configurations
   */
  controls: z.array(controlSchema),

  /**
   * Bundle url
   */
  bundleUrl: z.string(),

  /**
   * Bundle module id
   */
  moduleId: z.string()
})

/**
 * Operation entity
 */
export type Operation = z.infer<typeof operationSchema>

export const operationIssueSchema = z.object({
  type: z.enum(['error', 'warn', 'info']),
  controlName: z.string().optional(),
  message: z.string(),
  description: z.string().optional()
})

/**
 * An operation result hint is an error, warning or information that occurred
 * while processing an operation request.
 */
export type OperationIssue = z.infer<typeof operationIssueSchema>

/**
 * A well-formed operation request
 */
export interface OperationRequest {
  /**
   * The current value for each control
   */
  values: { [controlName: string]: TypedValue }

  /**
   * Array of control names ordered by priority (highest to lowest)
   * Allows the operation to decide on what direction the content flows.
   */
  controlPriorities: string[]
}

export const operationResultSchema = z.object({
  changes: namedControlChangesSchema.optional(),
  issues: z.array(operationIssueSchema).optional()
})

/**
 * A well-formed operation result
 */
export type OperationResult = z.infer<typeof operationResultSchema>

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
   * Bundle url
   */
  bundleUrl: string

  /**
   * Bundle module id
   */
  moduleId: string
}
