
import { getNode, hasNode } from '../selectors/blueprint'
import {
  BlueprintNode,
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { VariableNode } from '../types/variable'
import { getControlNode } from '../selectors/control'
import { ControlNode } from '../types/control'
import { getVariableNode } from '../selectors/variable'
import { arrayRemove } from 'utils/array'

/**
 * Generate a new node id that has not been assigned, yet.
 * @param state Blueprint state
 * @returns New node id
 */
export const nextNodeId = (state: BlueprintState): number => {
  do {
    state.lastInsertNodeId = (state.lastInsertNodeId + 1) % Number.MAX_SAFE_INTEGER
  } while (state.nodes[state.lastInsertNodeId] !== undefined)
  return state.lastInsertNodeId
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
    throw new Error(`Node type '${childType}' can't be added to '${parentType}'`)
  }
}

/**
 * Remove a node and its children from the blueprint.
 * @param state Blueprint state
 * @param nodeId Id of node to be removed
 */
export const removeNode = (state: BlueprintState, nodeId: BlueprintNodeId): void => {
  if (!hasNode(state, nodeId)) {
    return
  }

  const node = getNode(state, nodeId)
  if (node.id === node.parentId) {
    throw new Error('The root node can\'t be removed')
  }

  // Remove child nodes recursively (bottom-up removal)
  node.childIds.forEach(removeNode.bind(null, state))

  // Clean up relationships between nodes (other than parent-child)
  let variable, control
  let variableIds: Array<BlueprintNodeId | undefined>
  switch (node.type) {
    case BlueprintNodeType.Variable:
      variable = node as VariableNode
      variable.attachmentIds.forEach(attachmentId => {
        const control = getControlNode(state, attachmentId)
        if (control.attachedInternVariableId === nodeId) {
          control.attachedInternVariableId = undefined
        } else if (control.attachedVariableId === nodeId) {
          control.attachedVariableId = undefined
        }
      })
      break

    case BlueprintNodeType.Control:
      control = node as ControlNode
      variableIds = [control.attachedInternVariableId, control.attachedVariableId]
      for (let i = 0; i < variableIds.length; i++) {
        const variableId = variableIds[i]
        if (variableId !== undefined) {
          const variable = getVariableNode(state, variableId)
          variable.attachmentIds = arrayRemove(variable.attachmentIds, nodeId)
          if (variable.attachmentIds.length === 0) {
            removeNode(state, variable.id)
          }
        }
      }
      break
  }

  // Remove blueprint references
  if (state.selectedNodeId === nodeId) {
    state.selectedNodeId = undefined
  }
  if (state.activeProgramId === nodeId) {
    state.activeProgramId = node.parentId
  }

  // Remove parent reference to self
  const parentNode = getNode(state, node.parentId)
  parentNode.childIds = parentNode.childIds.filter(id => id !== nodeId)

  // Remove self from blueprint
  delete state.nodes[node.id] // eslint-disable-line
}

/**
 * Select a node or clear the selection.
 */
export const selectNode = (state: BlueprintState, nodeId: BlueprintNodeId | undefined): void => {
  state.selectedNodeId = nodeId
}
