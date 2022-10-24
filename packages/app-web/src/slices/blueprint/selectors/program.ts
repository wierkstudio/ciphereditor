
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { ProgramNode } from '@ciphereditor/library'
import { ProgramNodeState } from '../types/program'
import { getNode, getNodeChildren } from './blueprint'
import { serializeControl } from './control'
import { serializeOperation } from './operation'
import { serializeVariable } from './variable'
import { DirectoryState } from '../../directory/types'

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
        serializedChildren.push(serializeControl(state, directory, child.id))
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
    frame: program.frame
  }

  if (serializedChildren.length > 0) {
    serializedProgram.children = serializedChildren
  }

  return serializedProgram
}
