
import {
  BlueprintNodeState,
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import {
  Blueprint,
  BlueprintNode,
  collectNodesIds,
  VariableNode
} from '@ciphereditor/library'
import { DirectoryState } from '../../directory/types'
import { UICanvasMode } from '../../ui/types'
import { serializeControl } from './control'
import { serializeOperation } from './operation'
import { serializeProgram } from './program'
import { serializeVariable } from './variable'

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

/**
 * Serialize a selection of nodes that descend from the same parent.
 * Variable nodes within this selection will be ignored and replaced by
 * variables that form connections between the remaining nodes.
 * @param state Blueprint state slice
 * @param directory Directory state slice used to retrieve operation meta data
 * necessary to serialize embedded operations
 * @param nodeIds Ids of nodes to be serialized
 * @returns JSON serializable objects representing the nodes of the given ids
 */
export const serializeNodes = (
  state: BlueprintState,
  directory: DirectoryState | undefined,
  nodeIds: BlueprintNodeId[]
): BlueprintNode[] => {
  // Retrieve selected nodes and filter out variables
  const nodes = nodeIds
    .map(nodeId => getNode(state, nodeId))
    .filter(node => node.type !== BlueprintNodeType.Variable)

  if (nodes.length === 0) {
    return []
  }

  // Verify assumption: Nodes to be serialized must descend from the same parent
  const parentId = nodes[0].parentId
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].parentId !== parentId) {
      throw new Error('Logic error: Nodes to be serialized must descend from the same parent')
    }
  }

  // Serialize nodes that are not variables
  const serializedNodes = nodes
    .map(node => serializeNode(state, directory, node.id))
  const serializedNodeIds = collectNodesIds(serializedNodes)

  // Get variable nodes that descend from the same parent and serialize them.
  // Next, strip attachments that are not referenced by the serialized nodes.
  // Finally, strip variable nodes that do not form a connection between two or
  // more nodes.
  const serializedVariables = (
    getNodeChildren(state, parentId, BlueprintNodeType.Variable)
      .map(variable => serializeVariable(state, variable.id))
      .map(serializedVariable => serializedVariable === undefined
        ? undefined
        : {
            ...serializedVariable,
            attachments: serializedVariable.attachments.filter(id =>
              serializedNodeIds.includes(id))
          })
      .filter(serializedVariable =>
        serializedVariable !== undefined &&
        serializedVariable.attachments.length >= 2)
  ) as VariableNode[]

  return serializedNodes.concat(serializedVariables)
}

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
