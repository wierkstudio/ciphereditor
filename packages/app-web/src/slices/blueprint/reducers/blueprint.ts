
import {
  BlueprintNodeId,
  BlueprintNodeState,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { Blueprint, BlueprintNode } from '@ciphereditor/library'
import { ControlNodeState } from '../types/control'
import { DirectoryState } from '../../directory/types'
import { ProgramNodeState } from '../types/program'
import { VariableNodeState } from '../types/variable'
import { addControlNode } from './control'
import { addOperationNode } from './operation'
import { addProgramNode, updateProgramContentBounds } from './program'
import { addVariable, attachControlToVariable } from './variable'
import { arrayRemove, arrayUnique } from '../../../lib/utils/array'
import { getControlNode } from '../selectors/control'
import { getNode, hasNode } from '../selectors/blueprint'
import { getVariableNode } from '../selectors/variable'

/**
 * Generate a new node id that has not been assigned, yet.
 * @param state Blueprint state slice
 * @returns New unique node id
 */
export const nextNodeId = (state: BlueprintState): number => {
  do {
    state.lastInsertNodeId = (state.lastInsertNodeId + 1) % Number.MAX_SAFE_INTEGER
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
      throw new Error(`The root node must be of type program but found '${childType}'`)
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
    throw new Error(`Node type '${childType}' can't be added to '${parentType}'`)
  }

  if (childId !== parentId) {
    parentNode.childIds.push(childId)
  }

  if (parentNode.type === BlueprintNodeType.Program) {
    updateProgramContentBounds(state, parentNode.id)
  }

  return childNode
}

/**
 * Add the given nodes to the state
 * @param state Blueprint state slice
 * @param nodes Nodes to be added
 * @param programId Parent program id or `undefined`, if the currently active
 * program should be used. If the active program is `undefined` the given nodes
 * are added next to the previous root program (creating a new root).
 * @param directory Directory state slice used to instanciate operations.
 * If set to `undefined` placeholder operation nodes will be added, instead.
 * @param refIdMap Object mapping serialized ids to instanciated ids found
 * while adding nodes. Tracking these ids is necessary to resolve variable
 * attachments in the parent program.
 */
export const addNodes = (
  state: BlueprintState,
  nodes: BlueprintNode[],
  programId?: BlueprintNodeId,
  directory?: DirectoryState,
  refIdMap: Record<string, BlueprintNodeId> = {}
): BlueprintNodeState[] => {
  const parentId =
    programId ??
    state.activeProgramId ??
    // Create a new program and install it as the new root
    addProgramNode(state, { type: 'program' }, undefined).id

  // TODO: Make sure variables are added last (as we need attachment ids)
  return nodes.map((node): BlueprintNodeState => {
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
        // TODO: Make sure the push/pull controls are maintained
        // TODO: Throw if at least one ref id can't be resolved
        const attachmentIds = node.attachments.map(refId => {
          const nodeId = refIdMap[refId]
          if (nodeId === undefined) {
            throw new Error(`Reference id ${refId} cannot be resolved to a node id`)
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
        throw new Error(`Node with type '${nodeType as string}' cannot be added`)
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

      const allowed = parent.type !== BlueprintNodeType.Operation
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
  width: number,
  height: number
): void => {
  const node = getNode(state, nodeId)
  if (node.frame === undefined) {
    // Nodes without frames can't be layed out
    return
  }

  if (node.frame.width === width && node.frame.height === height) {
    return
  }

  // Update node frame
  node.frame.width = width
  node.frame.height = height

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
  const program = addProgramNode(state, blueprint.program, undefined, directory)
  state.rootProgramId = program.id
  state.activeProgramId = program.id
  removeNode(state, previousRootProgramId)
}
