
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { DirectoryState } from '../../directory/types'
import { ProgramNodeState } from '../types/program'
import { addChildNode, addNodes, nextNodeId } from './blueprint'
import { defaultNodeSize } from '../../../constants'
import { deriveUniqueName } from '../../../lib/utils/string'
import { getNextNodeFrame, getNode, getNodeChildren } from '../selectors/blueprint'
import { movePointBy, Point, ProgramNode } from '@ciphereditor/library'

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
 * Add the given program to the state
 * @param state Blueprint state slice
 * @param programNode Program to be added
 * @param parentId Parent program id or `undefined`, if the given program node
 * should be added as the new root program. In the latter case the previous
 * root program is added as a child to the new root.
 * @param directory Directory state slice used to instanciate operations
 * embedded in the program to be added. If set to `undefined` placeholder
 * operation nodes will be added, instead.
 * @param refIdMap Object mapping serialized ids to instanciated ids found
 * while adding nodes. Tracking these ids is necessary to resolve variable
 * attachments in the parent program.
 */
export const addProgramNode = (
  state: BlueprintState,
  programNode: ProgramNode,
  parentId: BlueprintNodeId | undefined,
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
  const uniqueLabel =
    deriveUniqueName(label ?? defaultProgramNode.label, usedLabels)

  const program: ProgramNodeState = {
    ...defaultProgramNode,
    id,
    parentId: parentId ?? id,
    childIds: [],
    label: uniqueLabel,
    offset: programNode.offset ?? defaultProgramNode.offset,
    frame: parentId !== undefined
      ? getNextNodeFrame(state, parentId, programNode.frame)
      : defaultProgramNode.frame
  }

  addChildNode(state, program)

  if (programNode.children !== undefined) {
    addNodes(state, programNode.children, false, id, directory, refIdMap)
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
  if (state.activeProgramId === undefined) {
    state.rootOffset = relative ? movePointBy(state.rootOffset, offset) : offset
  } else {
    const program = getNode(state, state.activeProgramId, BlueprintNodeType.Program) as ProgramNodeState
    program.offset = relative ? movePointBy(program.offset, offset) : offset
  }
}
