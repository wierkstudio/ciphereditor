
import { BlueprintNodeState, BlueprintNodeId } from './blueprint'
import { OperationIssue, Rect } from '@ciphereditor/library'

/**
 * Operation node
 */
export interface OperationNodeState extends BlueprintNodeState {
  /**
   * Node type
   */
  type: 'operation'

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
   *
   * Possible states:
   * - `idle` - The operation is idle and ready
   * - `busy` - Operation request is currently being processed
   * - `error` - An error occured during the last request, await manual retry
   */
  state: 'ready' | 'busy' | 'error'

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
