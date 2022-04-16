
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { controlSchema } from './control'
import { z } from 'zod'

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

/**
 * Operation state
 */
export enum OperationState {
  /**
   * The operation is idle and ready
   */
  Ready,

  /**
   * Computation task is ongoing
   */
  Busy,

  /**
   * Last computation task failed, await manual retry
   */
  Failed
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
   * Number identifying the current operation task
   */
  taskVersion?: number

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
