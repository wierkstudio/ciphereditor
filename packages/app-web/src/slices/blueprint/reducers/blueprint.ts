
import {
  BlueprintNodeId,
  BlueprintNodeState,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import {
  Blueprint,
  BlueprintNode,
  deltaPoint,
  getCombinedBlueprintNodesRect,
  getRectFromOriginAndSize,
  getRectOrigin,
  getRectSize,
  getSizeCenter,
  movePointBy,
  Size,
  sizeEqualTo
} from '@ciphereditor/library'
import { ControlNodeState } from '../types/control'
import { DirectoryState } from '../../directory/types'
import { OperationExecutionState, OperationNodeState } from '../types/operation'
import { ProgramNodeState } from '../types/program'
import { VariableNodeState } from '../types/variable'
import { addControlNode } from './control'
import { addOperationNode } from './operation'
import { addProgramNode, defaultProgramNode, updateProgramContentBounds } from './program'
import { addVariable, attachControlToVariable } from './variable'
import { arrayRemove, arrayUnique, arrayUniquePush } from '../../../lib/utils/array'
import { getControlNode } from '../selectors/control'
import { getNextNodeFrame, getNode, hasNode } from '../selectors/blueprint'
import { getProgramNode } from '../selectors/program'
import { getVariableNode } from '../selectors/variable'

/**
 * Generate a new node id that has not been assigned, yet.
 * @param state Blueprint state slice
 * @returns New unique node id
 */
export const nextNodeId = (state: BlueprintState): number => {
  do {
    state.lastInsertNodeId =
      (state.lastInsertNodeId + 1) % Number.MAX_SAFE_INTEGER
  } while (state.nodes[state.lastInsertNodeId] !== undefined)
  return state.lastInsertNodeId
}

/**
 * Add the given node as a child to the blueprint state tree.
 * @param state Blueprint state slice
 * @param childNode Child node to be added
 * @returns Child node
 */
export const addChildNode = <T extends BlueprintNodeState>(
  state: BlueprintState,
  childNode: T
): T => {
  const childId = childNode.id
  const childType = childNode.type
  const parentId = childNode.parentId

  // Add node to the blueprint node map
  state.nodes[childId] = childNode

  // Special case: A self-referencing node is considered a new root node
  if (childId === parentId) {
    if (childType !== BlueprintNodeType.Program) {
      throw new Error(
        `The root node must be of type program but found '${childType}'`)
    }

    // Add previous root node as a child to the new root node
    const childProgram = (childNode as any) as ProgramNodeState
    childProgram.offset = state.rootOffset
    state.rootOffset = { x: 0, y: 0 }

    const previousRootNode = getNode(state, state.rootProgramId)
    childNode.childIds.push(previousRootNode.id)
    previousRootNode.parentId = childNode.id
    state.rootProgramId = childNode.id
    if (state.activeProgramId === previousRootNode.id) {
      state.activeProgramId = childNode.id
    }
  }

  // Verify that the child node can be added to this parent node
  const parentNode = getNode(state, parentId)
  const parentType = parentNode.type
  if (parentType !== BlueprintNodeType.Program &&
      (parentType !== BlueprintNodeType.Operation ||
        childType !== BlueprintNodeType.Control)) {
    throw new Error(
      `Node type '${childType}' can't be added to '${parentType}'`)
  }

  if (childId !== parentId) {
    parentNode.childIds.push(childId)
  }

  if (parentNode.type === BlueprintNodeType.Program) {
    updateProgramContentBounds(state, parentNode.id)
  }

  // Update busy operation ids if a busy operation was added
  if (childNode.type === BlueprintNodeType.Operation) {
    const operation = (childNode as any) as OperationNodeState
    if (operation.state === OperationExecutionState.Busy) {
      state.busyOperationIds =
        arrayUniquePush(state.busyOperationIds, operation.id)
    }
  }

  return childNode
}

/**
 * Add the given nodes to the blueprint state at the current program offset.
 * If multiple nodes are added, make sure the relative positioning stays intact.
 * @param state Blueprint state
 * @param nodes Nodes to be added
 * @param moveFrameToOffset Wether to move the nodes frame to the program
 * offset. If set to `false` the original nodes frame will be maintained.
 * @param programId Parent program id or `undefined`, if the currently active
 * program should be used. If the active program is `undefined` the given nodes
 * are added next to the root program (creating a new root program around it).
 * @param directory Directory state slice used to instanciate operations.
 * If set to `undefined` placeholder operation nodes will be added, instead.
 * @param refIdMap Object mapping serialized ids to instanciated ids found
 * while adding nodes. Tracking these ids is necessary to resolve variable
 * attachments in the parent program.
 */
export const addNodes = (
  state: BlueprintState,
  nodes: BlueprintNode[],
  moveFrameToOffset: boolean,
  programId?: BlueprintNodeId,
  directory?: DirectoryState,
  refIdMap: Record<string, BlueprintNodeId> = {}
): BlueprintNodeState[] => {
  const parentId =
    programId ??
    state.activeProgramId ??
    // Create a new program and install it as the new root
    addProgramNode(state, { type: 'program' }, undefined).id

  // Compute the rect of all node frames to be added, combined together
  const nextFrame = getNextNodeFrame(state, parentId)
  const originalNodesFrame = getCombinedBlueprintNodesRect(nodes) ?? nextFrame

  // If requested, align the center of the nodes frame with the program offset
  let targetNodesFrame = originalNodesFrame
  if (moveFrameToOffset) {
    const program = getProgramNode(state, parentId)
    targetNodesFrame = getRectFromOriginAndSize(
      deltaPoint(program.offset, getSizeCenter(originalNodesFrame)),
      getRectSize(originalNodesFrame)
    )
  }

  const nodesFrame = getNextNodeFrame(state, parentId, targetNodesFrame)
  const repositionVector = deltaPoint(nodesFrame, originalNodesFrame)

  // Order in which node types are being added
  const nodeTypeAddOrder: Array<BlueprintNode['type']> =
    ['program', 'operation', 'control', 'variable']

  return nodes
    // Assign a frame to each node where it will be positioned
    .map(node => {
      if (node.type === 'variable') {
        return node
      }
      const leadingTopPoint = node.frame !== undefined
        ? movePointBy(getRectOrigin(node.frame), repositionVector)
        : nextFrame
      const size = node.frame !== undefined
        ? getRectSize(node.frame)
        : getRectSize(nextFrame)
      const frame = getRectFromOriginAndSize(leadingTopPoint, size)
      return { ...node, frame }
    })

    // Make sure variables are added last
    .sort((a, b) =>
      nodeTypeAddOrder.indexOf(a.type) -
      nodeTypeAddOrder.indexOf(b.type))

    // Add each node to the blueprint state
    .map((node): BlueprintNodeState => {
      const nodeType = node.type
      switch (nodeType) {
        case 'operation': {
          return addOperationNode(state, node, parentId, directory, refIdMap)
        }
        case 'control': {
          return addControlNode(state, node, parentId, refIdMap)
        }
        case 'program': {
          return addProgramNode(state, node, parentId, directory, refIdMap)
        }
        case 'variable': {
          const attachmentIds = node.attachments.map(refId => {
            const nodeId = refIdMap[refId]
            if (nodeId === undefined) {
              throw new Error(
                `Reference id ${refId} cannot be resolved to a node id`)
            }
            return nodeId
          })

          if (attachmentIds.length === 0) {
            throw new Error('Variable must have at least one attachment')
          }

          const [firstControlId, ...remainingControlIds] = attachmentIds
          const firstControl = getControlNode(state, firstControlId)
          const outward = firstControl.parentId !== parentId
          const variable = addVariable(state, firstControlId, outward)
          for (const controlId of remainingControlIds) {
            attachControlToVariable(state, controlId, variable.id)
          }
          return variable
        }
        default: {
          throw new Error(
            `Node with type '${nodeType as string}' cannot be added`)
        }
      }
    })
}

/**
 * Remove the given node and its children from the blueprint tree, making sure
 * the state stays intact (updating node id references).
 * @param state Blueprint state slice
 * @param nodeId Id of node to be removed
 */
export const removeNode = (
  state: BlueprintState,
  nodeId: BlueprintNodeId
): void => {
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
  switch (node.type) {
    case BlueprintNodeType.Variable: {
      const variable = node as VariableNodeState
      variable.attachmentIds.forEach(attachmentId => {
        const control = getControlNode(state, attachmentId)
        if (control.attachedVariableId === nodeId) {
          control.attachedVariableId = undefined
        } else if (control.attachedOutwardVariableId === nodeId) {
          control.attachedOutwardVariableId = undefined
        }
      })
      break
    }
    case BlueprintNodeType.Control: {
      const control = node as ControlNodeState
      const variableIds =
        [control.attachedVariableId, control.attachedOutwardVariableId]
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
  }

  // Remove blueprint references
  if (state.selectedNodeIds.includes(nodeId)) {
    state.selectedNodeIds = arrayRemove(state.selectedNodeIds, nodeId)
  }
  if (state.activeProgramId === nodeId) {
    state.activeProgramId = node.parentId
  }

  // Remove parent reference to self
  const parentNode = getNode(state, node.parentId)
  parentNode.childIds = parentNode.childIds.filter(id => id !== nodeId)

  // Remove self from blueprint
  delete state.nodes[node.id] // eslint-disable-line

  if (parentNode.type === BlueprintNodeType.Program) {
    updateProgramContentBounds(state, parentNode.id)
  }
}

/**
 * Check for each of the given nodes wether it is allowed to be manually
 * removed from the tree and if so, remove it.
 * Example: A child node of an operation cannot be removed without its parent
 */
export const deleteNodes = (
  state: BlueprintState,
  nodeIds: BlueprintNodeId[]
): void => {
  for (const nodeId of nodeIds) {
    if (hasNode(state, nodeId)) {
      const node = getNode(state, nodeId)
      const parent = getNode(state, node.parentId)
      const allowed =
        // Operation child nodes can't be deleted individually
        parent.type !== BlueprintNodeType.Operation &&
        // The root program can't be deleted
        node.id !== node.parentId

      if (allowed) {
        removeNode(state, nodeId)
      }
    }
  }
}

/**
 * Reposition the given node to the given absolute or relative coordinates.
 */
export const moveNode = (
  state: BlueprintState,
  nodeId: BlueprintNodeId,
  x: number,
  y: number,
  relative: boolean
): void => {
  if (relative && x === 0 && y === 0) {
    return
  }

  const node = getNode(state, nodeId)
  if (node.frame === undefined) {
    // Nodes without frames are not movable
    return
  }

  // Update node frame
  node.frame.x = relative ? node.frame.x + x : x
  node.frame.y = relative ? node.frame.y + y : y

  // Update parent program boundary
  const parentNode = getNode(state, node.parentId)
  if (parentNode.type === BlueprintNodeType.Program) {
    updateProgramContentBounds(state, parentNode.id)
  }
}

export const layoutNode = (
  state: BlueprintState,
  nodeId: BlueprintNodeId,
  size: Size
): void => {
  const node = getNode(state, nodeId)
  if (node.frame === undefined) {
    // Nodes without frames can't be layed out
    return
  }

  if (sizeEqualTo(node.frame, size)) {
    return
  }

  // Update node frame
  node.frame = getRectFromOriginAndSize(getRectOrigin(node.frame), size)

  // Update program boundary
  const parentNode = getNode(state, node.parentId)
  if (parentNode.type === BlueprintNodeType.Program) {
    updateProgramContentBounds(state, parentNode.id)
  }
}

/**
 * Replace the current selection by the given nodes.
 */
export const selectNodes = (
  state: BlueprintState,
  nodeIds: BlueprintNodeId[]
): void => {
  state.selectedNodeIds = arrayUnique(nodeIds)
}

/**
 * Reset the blueprint to start from scratch
 */
export const clearBlueprint = (
  state: BlueprintState
): void => {
  const previousRootProgramId = state.rootProgramId
  const program = addProgramNode(state, defaultProgramNode, undefined)
  state.activeProgramId = program.id
  state.rootOffset = defaultProgramNode.offset
  removeNode(state, previousRootProgramId)
}

/**
 * Load the given blueprint into the state, replacing existing nodes.
 * @param state Blueprint state slice
 * @param blueprint Blueprint to be loaded
 * @param directory Directory state slice used to instanciate operations.
 * If set to `undefined` placeholder operation nodes will be added, instead
 */
export const loadBlueprint = (
  state: BlueprintState,
  blueprint: Blueprint,
  directory?: DirectoryState
): void => {
  //       /\     /\
  //      '. \   / ,'
  //        `.\-/,'
  //        ( X   )
  //        ,'/ \`.\
  //      .' /   \ `,
  //      \/-----\/'
  // _______|_|___|_______
  // Remembering Mr. Berg
  // Credits: https://ascii.co.uk/art/windmill

  const previousRootProgramId = state.rootProgramId

  // When loading a blueprint, a new root program will be created around the
  // current root program, following the serialized blueprint description.
  // The placement of the new root program's children should not be influenced
  // by the placement of the old root program (that will be deleted at the end).
  // This is why we move the old root program far off into the distance.
  const previousRootProgram = getProgramNode(state, previousRootProgramId)
  previousRootProgram.offset = {
    x: Number.MIN_SAFE_INTEGER,
    y: Number.MAX_SAFE_INTEGER
  }

  // Add new program and install it as root
  const program = addProgramNode(state, blueprint.program, undefined, directory)

  // Enter into the new root program
  state.activeProgramId = program.id
  state.rootOffset = defaultProgramNode.offset

  // Remove the old root program
  removeNode(state, previousRootProgramId)
}
