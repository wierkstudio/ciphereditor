
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { ProgramNode } from '../types/program'
import { getNode } from './blueprint'

/**
 * Find a program node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Program node
 */
export const getProgramNode = (state: BlueprintState, id: BlueprintNodeId): ProgramNode =>
  getNode(state, id, BlueprintNodeType.Program) as ProgramNode

/**
 * Get active program node.
 */
export const getActiveProgram = (state: BlueprintState): ProgramNode | undefined =>
  state.activeProgramId !== undefined ? getProgramNode(state, state.activeProgramId) : undefined
