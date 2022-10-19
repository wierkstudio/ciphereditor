
import { BlueprintNodeState, BlueprintNodeId, BlueprintNodeType } from './blueprint'

/**
 * Variable node
 * Variables are the connections between two or more controls within a program
 */
export interface VariableNodeState extends BlueprintNodeState {
  /**
   * Node type
   */
  type: BlueprintNodeType.Variable

  /**
   * Variables do not have an own frame. Their positioning depends
   * on the attachments.
   */
  frame?: undefined

  /**
   * Node ids of attached controls in order of propagation;
   * The first element points to the control a value last propagated from.
   */
  attachmentIds: BlueprintNodeId[]
}
