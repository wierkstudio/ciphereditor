
import {
  ProgramNode,
  Rect,
  roundPoint,
  roundRect
} from '@ciphereditor/library'
import { BlueprintNodeId, BlueprintState } from '../types/blueprint'
import { DirectoryState } from '../../directory/types'
import { ProgramNodeState } from '../types/program'
import { getNode, getNodeChildren, serializeNode } from './blueprint'
import { serializeVariable } from './variable'

/**
 * Find a program node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Program node
 */
export const getProgramNode = (
  state: BlueprintState,
  id: BlueprintNodeId
): ProgramNodeState =>
  getNode(state, id, 'program') as ProgramNodeState

/**
 * Get active program node.
 */
export const getActiveProgram = (
  state: BlueprintState
): ProgramNodeState | undefined =>
  state.activeProgramId !== undefined
    ? getProgramNode(state, state.activeProgramId)
    : undefined

/**
 * Return the current canvas content bounds used to layout scrollbars
 */
export const getContentBounds = (state: BlueprintState): Rect | undefined => {
  if (state.activeProgramId !== undefined) {
    const activeProgram = getProgramNode(state, state.activeProgramId)
    return activeProgram.contentBounds
  } else {
    const rootProgram = getProgramNode(state, state.rootProgramId)
    return rootProgram.frame
  }
}

/**
 * Return the ids of non-variable nodes that are currently visible on the canvas
 */
export const getVisibleNodeIds = (state: BlueprintState): BlueprintNodeId[] => {
  if (state.activeProgramId !== undefined) {
    return getNodeChildren(state, state.activeProgramId)
      .filter(node => node.type !== 'variable')
      .map(node => node.id)
  } else {
    // Outside the root program you can only see the root program itself
    return [state.rootProgramId]
  }
}

/**
 * Return the ids of variable nodes that are currently visible on the canvas
 */
export const getVisibleVariableIds = (state: BlueprintState): BlueprintNodeId[] => {
  if (state.activeProgramId !== undefined) {
    return getNodeChildren(state, state.activeProgramId)
      .filter(node => node.type === 'variable')
      .map(node => node.id)
  } else {
    // Outside the root program there are no variables or wires
    return []
  }
}

/**
 * Export a program from the blueprint state to a JSON serializable object.
 * The resulting object may be extracted using `addProgramNode`.
 * @param state Blueprint state slice
 * @param operationId Id of the operation node to be serialized
 * @param directory Directory state slice used to retrieve operation meta data
 * necessary to serialize embedded operations
 * @returns JSON serializable object representing the operation node
 */
export const serializeProgram = (
  state: BlueprintState,
  directory: DirectoryState | undefined,
  programId: BlueprintNodeId
): ProgramNode => {
  const program = getProgramNode(state, programId)
  const children = getNodeChildren(state, programId)

  const serializedChildren: ProgramNode['children'] = []
  for (const child of children) {
    if (child.type !== 'variable') {
      serializedChildren.push(serializeNode(state, directory, child.id))
    }
  }

  // Append variable nodes at the end
  for (const child of children) {
    if (child.type === 'variable') {
      const serializedVariable = serializeVariable(state, child.id)
      if (serializedVariable !== undefined) {
        serializedChildren.push(serializedVariable)
      }
    }
  }

  const serializedProgram: ProgramNode = {
    type: 'program',
    offset: roundPoint(program.offset),
    frame: roundRect(program.frame)
  }

  // Optional label
  if (program.alias !== undefined) {
    serializedProgram.label = program.alias
  }

  // Optional children
  if (serializedChildren.length > 0) {
    serializedProgram.children = serializedChildren
  }

  return serializedProgram
}
