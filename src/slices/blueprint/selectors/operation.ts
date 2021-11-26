
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from 'types/blueprint'
import { OperationNode } from 'types/operation'
import { getNode } from './blueprint'

/**
 * Find a variable node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Operation node
 */
export const getOperationNode = (state: BlueprintState, id: BlueprintNodeId) => {
  return getNode(state, id, BlueprintNodeType.Operation) as OperationNode
}
