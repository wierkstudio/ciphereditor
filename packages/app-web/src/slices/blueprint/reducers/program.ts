
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { DirectoryState } from '../../directory/types'
import { Point, ProgramNode, Rect } from '@ciphereditor/library'
import { ProgramNodeState } from '../types/program'
import { addChildNode, addNodes, nextNodeId } from './blueprint'
import { deriveUniqueName } from '../../../lib/utils/string'
import { getNextProgramChildFrame } from '../selectors/program'
import { getNode, getNodeChildren } from '../selectors/blueprint'
import { movePointBy } from '../../../lib/utils/2d'

// TODO: Move to a constants file
const defaultNodeSize = { width: 320, height: 96 }

/**
 * Default program node object
 */
export const defaultProgramNode: ProgramNodeState = {
  id: 1,
  type: BlueprintNodeType.Program,
  parentId: 1,
  childIds: [],
  label: 'Program',
  offset: { x: 0, y: 0 },
  frame: {
    x: -defaultNodeSize.width * 0.5,
    y: -defaultNodeSize.height * 0.5,
    width: defaultNodeSize.width,
    height: defaultNodeSize.height
  }
}

/**
 * Add the given program
 */
export const addProgramNode = (
  state: BlueprintState,
  parentId: BlueprintNodeId | undefined,
  programNode: ProgramNode,
  directory?: DirectoryState,
  refIdMap?: Record<string, BlueprintNodeId>
): ProgramNodeState => {
  const id = nextNodeId(state)

  // Choose unique program label
  const programs = parentId !== undefined
    ? getNodeChildren(state, parentId, BlueprintNodeType.Program) as ProgramNodeState[]
    : []
  const usedLabels = programs.map(program => program.label)
  const label = programNode.label
  const uniqueLabel = deriveUniqueName(label ?? defaultProgramNode.label, usedLabels)

  // Choose program frame
  let frame: Rect | undefined = programNode.frame
  if (frame === undefined && parentId !== undefined) {
    frame = getNextProgramChildFrame(state, parentId)
  } else if (frame === undefined) {
    frame = defaultProgramNode.frame
  }

  const program: ProgramNodeState = {
    ...defaultProgramNode,
    id,
    parentId: parentId ?? id,
    childIds: [],
    label: uniqueLabel,
    offset: programNode.offset ?? defaultProgramNode.offset,
    frame
  }

  addChildNode(state, program)

  if (programNode.children !== undefined) {
    addNodes(state, programNode.children, id, directory, refIdMap)
  }

  return program
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

/**
 * Set the current canvas offset/position depending on the active program
 */
export const moveOffset = (
  state: BlueprintState,
  offset: Point,
  relative: boolean
): void => {
  // TODO: Round points
  if (state.activeProgramId === undefined) {
    state.rootOffset = relative ? movePointBy(state.rootOffset, offset) : offset
  } else {
    const program = getNode(state, state.activeProgramId, BlueprintNodeType.Program) as ProgramNodeState
    program.offset = relative ? movePointBy(program.offset, offset) : offset
  }
}
