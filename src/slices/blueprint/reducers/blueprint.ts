
import { getNode } from '../selectors/blueprint'
import {
  BlueprintNode,
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from 'types/blueprint'

/**
 * Generate a new node id that has not been assigned, yet.
 * @param state Blueprint state
 * @returns New node id
 */
export const nextNodeId = (state: BlueprintState) => {
  do {
    state.nodeIdCounter = (state.nodeIdCounter + 1) % Number.MAX_SAFE_INTEGER
  } while (state.nodes[state.nodeIdCounter] !== undefined)
  return state.nodeIdCounter
}

/**
 * Add the given node to the blueprint.
 * @param state Blueprint state
 * @param childNode Child node to be added
 * @returns Child node
 */
export const addNode = <T extends BlueprintNode>(state: BlueprintState, childNode: T): T => {
  const childId = childNode.id
  const childType = childNode.type
  const parentId = childNode.parentId

  // Add node to the blueprint node map
  state.nodes[childId] = childNode

  // Special case: A self-referencing node is considered a new root node
  if (childId === parentId) {
    if (childType !== BlueprintNodeType.Program) {
      throw new Error(`The root node must be of type program but found '${childType}'`)
    }

    // Add previous root node as a child to the new root node
    const previousRootNode = getNode(state, state.rootProgramId)
    childNode.childIds.push(previousRootNode.id)
    previousRootNode.parentId = childNode.id
    state.rootProgramId = childNode.id
  }

  // Verify that the child node can be added to this parent node
  const parentNode = getNode(state, parentId)
  const parentType = parentNode.type
  if (parentType === BlueprintNodeType.Program ||
      (parentType === BlueprintNodeType.Operation &&
        childType === BlueprintNodeType.Control)) {
    parentNode.childIds.push(childId)
    return childNode
  } else {
    throw new Error(`Node type '${childNode}' can't be added to '${parentNode}'`)
  }
}

/**
 * Remove a node and its children from the blueprint.
 * @param state Blueprint state
 * @param nodeId Id of node to be removed
 */
export const removeNode = (state: BlueprintState, nodeId: BlueprintNodeId) => {
  const node = getNode(state, nodeId)

  if (node.id === node.parentId) {
    throw new Error(`The root node can't be removed`)
  }

  // Remove child nodes recursively (bottom-up removal)
  node.childIds.forEach(removeNode.bind(null, state))

  // TODO: Detach from other relationships (e.g. variables)

  // Remove parent reference to self
  const parentNode = getNode(state, node.parentId)
  parentNode.childIds = parentNode.childIds.filter(childId => childId === nodeId)

  // Remove self from blueprint
  delete state.nodes[node.id]
}
