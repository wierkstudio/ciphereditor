
import { BlueprintNodeState, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { OperationIssue } from '@ciphereditor/library'
import { Rect } from '../../../lib/utils/2d'

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
  contributionName: string

  /**
   * Operation label
   */
  label: string

  /**
   * Wether the same inputs always return the same output
   */
  reproducible: boolean

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
