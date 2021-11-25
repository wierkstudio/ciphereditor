
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../../types/blueprint'
import { VariableNode } from '../../types/variable'
import { findNode } from './blueprint'

/**
 * Find a variable node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Variable node
 */
export const findVariableNode = (state: BlueprintState, id: BlueprintNodeId) => {
  return findNode(state, id, BlueprintNodeType.Variable) as VariableNode
}
