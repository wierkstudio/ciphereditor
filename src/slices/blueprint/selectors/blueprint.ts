
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from '../types/blueprint'

/**
 * Find a node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @param expectedType Expected node type
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Node object
 */
export const getNode = (state: BlueprintState, id: BlueprintNodeId, expectedType?: BlueprintNodeType) => {
  const node = state.nodes[id]
  if (node === undefined) {
    throw new Error(`Node id ${id} is not part of the blueprint`)
  }
  if (expectedType !== undefined && node.type !== expectedType) {
    throw new Error(`Expected node type '${expectedType}' but found '${node.type}'`)
  }
  return state.nodes[id]
}

/**
 * Check for the existence of a node with the given id
 */
export const hasNode = (state: BlueprintState, id: BlueprintNodeId) =>
  state.nodes[id] !== undefined

export const getSelectedNode = (state: BlueprintState) =>
  state.selectedNodeId ? getNode(state, state.selectedNodeId) : undefined

export const isSelectedNode = (state: BlueprintState, nodeId: BlueprintNodeId) =>
  state.selectedNodeId === nodeId

export const getNodeChildren = (
  state: BlueprintState,
  parentId: BlueprintNodeId,
  type?: BlueprintNodeType
) =>
  getNode(state, parentId)
    .childIds
    .map(id => getNode(state, id))
    .filter(node => !type || node.type === type)

export const getNodePosition = (
  state: BlueprintState,
  nodeId: BlueprintNodeId
) => {
  const node = getNode(state, nodeId)
  if (node.x === undefined || node.y === undefined) {
    throw new Error('Trying to access the position of a node that has none set')
  }
  return { x: node.x, y: node.y }
}
