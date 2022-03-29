
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { ProgramNode } from '../types/program'
import { addNode, nextNodeId } from './blueprint'

/**
 * Default program node object
 */
export const defaultProgramNode: ProgramNode = {
  id: 1,
  type: BlueprintNodeType.Program,
  parentId: 1,
  childIds: [],
  label: 'Program 1',
  x: 0,
  y: 0
}

/**
 * Add an empty program to the given parent program.
 * @param state Blueprint state
 * @param parentId Parent program node id
 * @returns New program node
 */
export const addEmptyProgramNode = (
  state: BlueprintState,
  parentId: BlueprintNodeId | undefined,
  x: number,
  y: number
): ProgramNode => {
  const id = nextNodeId(state)
  const programNode = {
    ...defaultProgramNode,
    id,
    parentId: parentId ?? id,
    label: `Program ${id}`,
    x,
    y
  }
  return addNode(state, programNode)
}
