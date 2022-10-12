
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { ProgramNode } from '../types/program'
import { addNode, nextNodeId } from './blueprint'
import { deriveUniqueName } from '../../../lib/utils/string'
import { getNode, getNodeChildren } from '../selectors/blueprint'

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

/**
 * Update the `contentBounds` property on the given program based on the current
 * layed out child nodes attached to it.
 */
export const updateProgramContentBounds = (
  state: BlueprintState,
  programId: BlueprintNodeId
): void => {
  const program = getNode(state, programId, BlueprintNodeType.Program) as ProgramNode
  const children = getNodeChildren(state, programId)

  let leadingX: number | undefined
  let trailingX: number | undefined
  let topY: number | undefined
  let bottomY: number | undefined

  for (const child of children) {
    if (
      child.x !== undefined &&
      child.width !== undefined &&
      child.y !== undefined &&
      child.height !== undefined
    ) {
      if (leadingX === undefined || leadingX > child.x) {
        leadingX = child.x
      }
      if (trailingX === undefined || trailingX < child.x + child.width) {
        trailingX = child.x + child.width
      }
      if (topY === undefined || topY > child.y) {
        topY = child.y
      }
      if (bottomY === undefined || bottomY < child.y + child.height) {
        bottomY = child.y + child.height
      }
    }
  }

  if (
    leadingX !== undefined &&
    trailingX !== undefined &&
    topY !== undefined &&
    bottomY !== undefined
  ) {
    program.contentBounds = {
      x: leadingX,
      y: topY,
      width: trailingX - leadingX,
      height: bottomY - topY
    }
  } else {
    program.contentBounds = undefined
  }
}
