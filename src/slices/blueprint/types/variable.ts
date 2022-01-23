
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'

/**
 * Variable node
 * Variables are the connections between two or more controls within a program
 */
export interface VariableNode extends BlueprintNode {
  /**
   * Node type
   */
  type: BlueprintNodeType.Variable

  /**
   * Node ids of attached controls in order of propagation;
   * The first element points to the control a value last propagated from.
   */
  attachmentIds: BlueprintNodeId[]
}
