
import { UICanvasMode } from '../../ui/types'
import {
  BlueprintNodeState,
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
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
export const getNode = (state: BlueprintState, id: BlueprintNodeId, expectedType?: BlueprintNodeType): BlueprintNodeState => {
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
 * Find a node by the given id or return undefined.
 */
export const getOptionalNode = (state: BlueprintState, id: BlueprintNodeId | undefined): BlueprintNodeState | undefined =>
  id !== undefined ? state.nodes[id] : undefined

/**
 * Check for the existence of a node with the given id
 */
export const hasNode = (state: BlueprintState, id: BlueprintNodeId): boolean =>
  state.nodes[id] !== undefined

export const getSelectedNode = (state: BlueprintState): BlueprintNodeState | undefined =>
  state.selectedNodeId !== undefined ? getNode(state, state.selectedNodeId) : undefined

export const isSelectedNode = (state: BlueprintState, nodeId: BlueprintNodeId): boolean =>
  state.selectedNodeId === nodeId

export const getNodeChildren = (
  state: BlueprintState,
  parentId: BlueprintNodeId,
  type?: BlueprintNodeType
): BlueprintNodeState[] =>
  getNode(state, parentId)
    .childIds
    .map(id => getNode(state, id))
    .filter(node => type === undefined || node.type === type)

/**
 * Retrive a node position on the plane or sequential canvas.
 */
export const getNodePosition = (
  state: BlueprintState,
  nodeId: BlueprintNodeId,
  canvasMode: UICanvasMode = UICanvasMode.Plane
): { x: number, y: number } | undefined => {
  const node = getNode(state, nodeId)
  if (canvasMode === UICanvasMode.Plane) {
    if (node.frame !== undefined) {
      return { x: node.frame.x, y: node.frame.y }
    }
  } else if (canvasMode === UICanvasMode.Sequential) {
    // TODO: Evacuate magic numbers
    let y = 96 // Canvas top padding at S-M
    // We sum up the heights and margins of the nodes situated above
    const siblings = getNodeChildren(state, node.parentId)
    for (const sibling of siblings) {
      if (sibling.frame !== undefined && sibling.id !== nodeId) {
        y += (sibling.frame.height ?? 0) + 24 // Node margin at S-M
      } else {
        break
      }
    }
    return { x: 0, y }
  }
  return undefined
}
