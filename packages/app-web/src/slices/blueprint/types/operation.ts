
import { BlueprintNodeState, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { OperationIssue, Rect } from '@ciphereditor/library'

/**
 * Operation execution state
 */
export enum OperationExecutionState {
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
export interface OperationNodeState extends BlueprintNodeState {
  /**
   * Node type
   */
  type: BlueprintNodeType.Operation

  /**
   * Size and position of the node
   */
  frame: Rect

  /**
   * Operation contribution name
   */
  name: string

  /**
   * Extension url
   */
  extensionUrl?: string

  /**
   * Wether the same inputs always return the same output
   */
  reproducible: boolean

  /**
   * Operation execution state
   */
  state: OperationExecutionState

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
   * Execution timeout (in ms)
   */
  timeout: number
}
