
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { Control } from './control'

/**
 * Operation entity
 */
export interface Operation {
  /**
   * Unique operation entity name
   */
  name: string

  /**
   * Operation label
   */
  label: string

  /**
   * Array of control configurations
   */
  controls: Control[]

  /**
   * Bundle url
   */
  bundleUrl: string

  /**
   * Bundle module id
   */
  moduleId: string
}

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
  Failed,
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
