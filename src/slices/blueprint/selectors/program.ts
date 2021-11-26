
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from 'types/blueprint'
import { ProgramNode } from 'types/program'
import { getNode } from './blueprint'

/**
 * Find a program node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Program node
 */
export const getProgramNode = (state: BlueprintState, id: BlueprintNodeId) =>
  getNode(state, id, BlueprintNodeType.Program) as ProgramNode

export const getActiveProgram = (state: BlueprintState) =>
  state.activeProgramId ? getProgramNode(state, state.activeProgramId) : undefined
