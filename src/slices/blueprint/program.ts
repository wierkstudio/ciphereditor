
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../../types/blueprint'
import { ProgramNode } from '../../types/program'
import { addNode, findNode, nextNodeId } from './blueprint'

/**
 * Default program node object
 */
export const defaultProgramNode: ProgramNode = {
  id: 1,
  type: BlueprintNodeType.Program,
  parentId: 1,
  childIds: [],
  label: 'Program 1',
}

/**
 * Find a program node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Program node
 */
export const findProgramNode = (state: BlueprintState, id: BlueprintNodeId) => {
  return findNode(state, id, BlueprintNodeType.Program) as ProgramNode
}

/**
 * Add an empty program to the given parent program.
 * @param state Blueprint state
 * @param parentId Parent program node id
 * @returns New program node
 */
export const addEmptyProgramNode = (state: BlueprintState, parentId?: BlueprintNodeId) => {
  const id = nextNodeId(state)
  const programNode = {
    ...defaultProgramNode,
    id,
    parentId: parentId || id,
    label: `Program ${id}`,
  }
  return addNode(state, programNode)
}
