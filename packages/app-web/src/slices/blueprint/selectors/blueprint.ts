
import {
  BlueprintNodeState,
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import {
  Blueprint,
  BlueprintNode,
  Rect,
  VariableNode,
  collectNodesIds,
  deltaPoint,
  getRectFromOriginAndSize,
  getRectOrigin,
  getRectSize,
  getSizeCenter,
  movePointBy,
  Point
} from '@ciphereditor/library'
import { DirectoryState } from '../../directory/types'
import { defaultNodeSize, nodeShiftVector } from '../../../constants'
import { getProgramNode, serializeProgram } from './program'
import { serializeControl } from './control'
import { serializeOperation } from './operation'
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
export const getNode = (
  state: BlueprintState,
  id: BlueprintNodeId,
  expectedType?: BlueprintNodeType
): BlueprintNodeState => {
  const node = state.nodes[id]
  if (node === undefined) {
    throw new Error(`Node id ${id} is not part of the blueprint`)
  }
  if (expectedType !== undefined && node.type !== expectedType) {
    throw new Error(
      `Expected node type '${expectedType}' but found '${node.type}'`)
  }
  return state.nodes[id]
}

/**
 * Find a node by the given id or return undefined.
 */
export const getOptionalNode = (
  state: BlueprintState,
  id: BlueprintNodeId | undefined
): BlueprintNodeState | undefined =>
  id !== undefined ? state.nodes[id] : undefined

/**
 * Check for the existence of a node with the given id
 */
export const hasNode = (state: BlueprintState, id: BlueprintNodeId): boolean =>
  state.nodes[id] !== undefined

export const getSelectedNodes = (state: BlueprintState): BlueprintNodeState[] =>
  state.selectedNodeIds.map(nodeId => getNode(state, nodeId))

export const isNodeSelected = (
  state: BlueprintState,
  nodeId: BlueprintNodeId
): boolean =>
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
 * Lay out the frame of an incoming node. Make sure two nodes are not placed on
 * top of each other by shifting them (e.g. when duplicating nodes).
 * @param state Blueprint state
 * @param programId Program in which the node frame is layed out
 * @param targetFrame Target frame or `undefined` to derive it from the current
 * program offset and default node size
 */
export const getNextNodeFrame = (
  state: BlueprintState,
  programId: BlueprintNodeId,
  targetFrame?: Rect
): Rect => {
  const program = getProgramNode(state, programId)
  let origin = targetFrame !== undefined
    ? getRectOrigin(targetFrame)
    : deltaPoint(program.offset, getSizeCenter(defaultNodeSize))

  // Shift the frame origin as long as another node is blocking it
  const nodes = getNodeChildren(state, programId)
  let blockingNode: BlueprintNodeState | undefined
  do {
    blockingNode = nodes.find(node =>
      node.frame !== undefined &&
      Math.abs(node.frame.x - origin.x) < nodeShiftVector.x &&
      Math.abs(node.frame.y - origin.y) < nodeShiftVector.y)
    if (blockingNode !== undefined) {
      origin = movePointBy(blockingNode.frame as Rect, nodeShiftVector)
    }
  } while (blockingNode !== undefined)

  // Compose non-blocking frame rect
  const size = targetFrame !== undefined
    ? getRectSize(targetFrame)
    : defaultNodeSize
  return getRectFromOriginAndSize(origin, size)
}

export const getPlaneCanvas = (state: BlueprintState): boolean =>
  state.planeCanvas

export const getCanvasOffset = (state: BlueprintState): Point =>
  state.activeProgramId !== undefined
    ? getProgramNode(state, state.activeProgramId).offset
    : state.rootOffset

export const getViewportRect = (state: BlueprintState): Rect => {
  const offset = getCanvasOffset(state)
  const size = state.canvasSize
  return {
    x: Math.round(offset.x - size.width * 0.5),
    y: Math.round(offset.y - size.height * 0.5),
    width: Math.round(size.width),
    height: Math.round(size.height)
  }
}

/**
 * Retrive a node position on the plane or sequential canvas.
 */
export const getNodePosition = (
  state: BlueprintState,
  nodeId: BlueprintNodeId
): Point | undefined => {
  const node = getNode(state, nodeId)
  if (state.planeCanvas) {
    if (node.frame !== undefined) {
      return { x: node.frame.x, y: node.frame.y }
    }
  } else {
    let y = 32
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
      throw new Error(
        'Logic error: Nodes to be serialized must descend from the same parent')
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
