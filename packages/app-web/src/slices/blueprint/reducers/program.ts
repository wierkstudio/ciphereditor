
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { ProgramNodeState } from '../types/program'
import { Rect } from '../../../lib/utils/2d'
import { addNode, nextNodeId } from './blueprint'
import { deriveUniqueName } from '../../../lib/utils/string'
import { getNode, getNodeChildren } from '../selectors/blueprint'

/**
 * Default program node object
 */
export const defaultProgramNode: ProgramNodeState = {
  id: 1,
  type: BlueprintNodeType.Program,
  parentId: 1,
  childIds: [],
  label: 'Program',
  frame: { x: 0, y: 0, width: 320, height: 48 }
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
  frame: Rect,
  label?: string
): ProgramNodeState => {
  const id = nextNodeId(state)

  // Choose unique program label
  const programs = parentId !== undefined
    ? getNodeChildren(state, parentId, BlueprintNodeType.Program) as ProgramNodeState[]
    : []
  const usedLabels = programs.map(program => program.label)
  const uniqueLabel = deriveUniqueName(label ?? defaultProgramNode.label, usedLabels)

  const programNode: ProgramNodeState = {
    ...defaultProgramNode,
    id,
    parentId: parentId ?? id,
    label: uniqueLabel,
    frame
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
  const program = getNode(state, programId, BlueprintNodeType.Program) as ProgramNodeState
  const children = getNodeChildren(state, programId)

  let leadingX: number | undefined
  let trailingX: number | undefined
  let topY: number | undefined
  let bottomY: number | undefined

  for (const child of children) {
    if (child.frame !== undefined) {
      if (leadingX === undefined || leadingX > child.frame.x) {
        leadingX = child.frame.x
      }
      if (trailingX === undefined || trailingX < child.frame.x + child.frame.width) {
        trailingX = child.frame.x + child.frame.width
      }
      if (topY === undefined || topY > child.frame.y) {
        topY = child.frame.y
      }
      if (bottomY === undefined || bottomY < child.frame.y + child.frame.height) {
        bottomY = child.frame.y + child.frame.height
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
