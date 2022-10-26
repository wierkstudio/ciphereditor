
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { DirectoryState } from '../../directory/types'
import { Point, ProgramNode, Rect, roundPoint, roundRect } from '@ciphereditor/library'
import { ProgramNodeState } from '../types/program'
import { getNode, getNodeChildren } from './blueprint'
import { serializeControl } from './control'
import { serializeOperation } from './operation'
import { serializeVariable } from './variable'

// TODO: Move to a constants file
const defaultNodeSize = { width: 320, height: 96 }

/**
 * Find a program node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Program node
 */
export const getProgramNode = (state: BlueprintState, id: BlueprintNodeId): ProgramNodeState =>
  getNode(state, id, BlueprintNodeType.Program) as ProgramNodeState

/**
 * Get active program node.
 */
export const getActiveProgram = (state: BlueprintState): ProgramNodeState | undefined =>
  state.activeProgramId !== undefined ? getProgramNode(state, state.activeProgramId) : undefined

/**
 * Return the current canvas offset/position depending on the active program
 */
export const getOffset = (state: BlueprintState): Point => {
  if (state.activeProgramId === undefined) {
    return state.rootOffset
  }
  const program = getNode(state, state.activeProgramId, BlueprintNodeType.Program) as ProgramNodeState
  return program.offset
}

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
      .filter(node => node.type !== BlueprintNodeType.Variable)
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
      .filter(node => node.type === BlueprintNodeType.Variable)
      .map(node => node.id)
  } else {
    // Outside the root program there are no variables or wires
    return []
  }
}

export const getNextProgramChildFrame = (state: BlueprintState, programId: BlueprintNodeId): Rect => {
  const program = getProgramNode(state, programId)
  return {
    x: program.offset.x - defaultNodeSize.width * 0.5,
    y: program.offset.y - defaultNodeSize.height * 0.5,
    width: defaultNodeSize.width,
    height: defaultNodeSize.height
  }
}

export const serializeProgram = (
  state: BlueprintState,
  directory: DirectoryState,
  programId: BlueprintNodeId
): ProgramNode => {
  const program = getProgramNode(state, programId)
  const children = getNodeChildren(state, programId)

  const serializedChildren: ProgramNode['children'] = []
  for (const child of children) {
    switch (child.type) {
      case BlueprintNodeType.Control: {
        serializedChildren.push(serializeControl(state, child.id))
        break
      }
      case BlueprintNodeType.Operation: {
        serializedChildren.push(serializeOperation(state, directory, child.id))
        break
      }
      case BlueprintNodeType.Program: {
        serializedChildren.push(serializeProgram(state, directory, child.id))
        break
      }
    }
  }

  // Append variable nodes at the end
  for (const child of children) {
    if (child.type === BlueprintNodeType.Variable) {
      const serializedVariable = serializeVariable(state, directory, child.id)
      if (serializedVariable !== undefined) {
        serializedChildren.push(serializedVariable)
      }
    }
  }

  const serializedProgram: ProgramNode = {
    type: 'program',
    label: program.label,
    offset: roundPoint(program.offset),
    frame: roundRect(program.frame)
  }

  if (serializedChildren.length > 0) {
    serializedProgram.children = serializedChildren
  }

  return serializedProgram
}
