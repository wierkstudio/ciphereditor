
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { ProgramNode } from '../types/program'
import { addNode, nextNodeId } from './blueprint'
import { deriveUniqueName } from '../../../lib/utils/string'
import { getNodeChildren } from '../selectors/blueprint'

/**
 * Default program node object
 */
export const defaultProgramNode: ProgramNode = {
  id: 1,
  type: BlueprintNodeType.Program,
  parentId: 1,
  childIds: [],
  label: 'Program',
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
  y: number,
  label?: string
): ProgramNode => {
  const id = nextNodeId(state)

  // Choose unique program label
  const programs = parentId !== undefined
    ? getNodeChildren(state, parentId, BlueprintNodeType.Program) as ProgramNode[]
    : []
  const usedLabels = programs.map(program => program.label)
  const uniqueLabel = deriveUniqueName(label ?? defaultProgramNode.label, usedLabels)

  const programNode: ProgramNode = {
    ...defaultProgramNode,
    id,
    parentId: parentId ?? id,
    label: uniqueLabel,
    x,
    y
  }
  return addNode(state, programNode)
}
