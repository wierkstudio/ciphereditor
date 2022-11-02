
import {
  BlueprintNodeState,
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { Blueprint, BlueprintNode } from '@ciphereditor/library'
import { UICanvasMode } from '../../ui/types'
import { serializeProgram } from './program'
import { DirectoryState } from '../../directory/types'
import { serializeControl } from './control'
import { serializeOperation } from './operation'

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

export const getSelectedNodes = (state: BlueprintState): BlueprintNodeState[] =>
  state.selectedNodeIds.map(nodeId => getNode(state, nodeId))

export const isNodeSelected = (state: BlueprintState, nodeId: BlueprintNodeId): boolean =>
  state.selectedNodeIds.includes(nodeId)

export const getHasSelection = (state: BlueprintState): boolean =>
  state.selectedNodeIds.length > 0

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

/**
 * Serialize the given control, operation or program node.
 */
export const serializeNode = (
  state: BlueprintState,
  directory: DirectoryState | undefined,
  nodeId: BlueprintNodeId
): BlueprintNode => {
  const node = getNode(state, nodeId)
  switch (node.type) {
    case BlueprintNodeType.Control: {
      return serializeControl(state, nodeId)
    }
    case BlueprintNodeType.Operation: {
      return serializeOperation(state, directory, nodeId)
    }
    case BlueprintNodeType.Program: {
      return serializeProgram(state, directory, nodeId)
    }
    default: {
      throw new Error(`Can't serialize node type ${node.type} individually`)
    }
  }
}

export const serializeNodes = (
  state: BlueprintState,
  directory: DirectoryState | undefined,
  nodeIds: BlueprintNodeId[]
): BlueprintNode[] =>
  nodeIds
    .map(nodeId => getNode(state, nodeId))
    .filter(node => node.type !== BlueprintNodeType.Variable)
    .map(node => node.id)
    // TODO: Serialize variables two or more of the given nodes are attached to
    .map(serializeNode.bind(null, state, directory))

/**
 * Export the blueprint state to a JSON serializable object.
 * The resulting object may be extracted using `loadBlueprint`.
 * @param state Blueprint state slice
 * @param directory Directory state slice used to retrieve operation meta data
 * necessary to serialize embedded operations
 * @returns JSON serializable object representing the current blueprint state
 */
export const serializeBlueprint = (
  state: BlueprintState,
  directory: DirectoryState
): Blueprint => {
  return {
    type: 'blueprint',
    program: serializeProgram(state, directory, state.rootProgramId)
  }
}
