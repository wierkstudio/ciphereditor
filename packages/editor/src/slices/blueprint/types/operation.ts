
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { Operation, OperationIssue, OperationResult } from 'cryptii-types'
import { controlSchema, namedControlChangesSchema } from './control'
import { z } from 'zod'

export const operationSchema: z.ZodType<Operation> = z.object({
  name: z.string(),
  label: z.string().optional(),
  controls: z.array(controlSchema)
})

export const extensionEntryPointSchema = z.object({
  /**
   * Bundle url
   */
  bundleUrl: z.string(),

  /**
   * Bundle module id
   */
  moduleId: z.string()
})

export const operationExtensionSchema = z.object({
  operation: operationSchema,
  entryPoint: extensionEntryPointSchema
})

export type OperationExtension = z.infer<typeof operationExtensionSchema>

export const operationIssueSchema: z.ZodType<OperationIssue> = z.object({
  type: z.enum(['error', 'warn', 'info']),
  controlName: z.string().optional(),
  message: z.string(),
  description: z.string().optional()
})

export const operationResultSchema: z.ZodType<OperationResult> = z.object({
  changes: namedControlChangesSchema.optional(),
  issues: z.array(operationIssueSchema).optional()
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
