
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from '../types/blueprint'
import { VariableNode } from '../types/variable'
import { getNode, getNodeChildren } from './blueprint'
import { getControlNode, isControlInternVariable } from './control'

/**
 * Find a variable node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Variable node
 */
export const getVariableNode = (state: BlueprintState, id: BlueprintNodeId) =>
  getNode(state, id, BlueprintNodeType.Variable) as VariableNode

/**
 * Return the variable currently attached to the given control within a program
 * context. By default, the active program context is used.
 */
export const getControlVariable = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId?: BlueprintNodeId,
) => {
  const intern = isControlInternVariable(state, controlId, programId)
  const control = getControlNode(state, controlId)
  const variableId = intern ? control.attachedInternVariableId : control.attachedVariableId
  return variableId ? getVariableNode(state, variableId) : undefined
}

/**
 * Return variables from the given program.
 */
export const getProgramVariables = (state: BlueprintState, programId: BlueprintNodeId) =>
  getNodeChildren(state, programId, BlueprintNodeType.Variable) as VariableNode[]

/**
 * Return the control that last propagated to a given variable.
 */
export const getVariableControl = (
  state: BlueprintState,
  variableId: BlueprintNodeId,
) => {
  const variable = getVariableNode(state, variableId)
  // TODO: Assertion: A variable is always attached to at least one control
  // Assertion: Variable attachment ids are ordered by when they propagated
  return getControlNode(state, variable.attachmentIds[0]!)
}

/**
 * Return all control nodes attached to a given variable.
 */
export const getVariableAttachedControls = (
  state: BlueprintState,
  variableId: BlueprintNodeId,
) =>
  getVariableNode(state, variableId)
    .attachmentIds
    .map(controlId => getControlNode(state, controlId))

/**
 * Return the current value for the given variable.
 */
export const getVariableValue = (state: BlueprintState, variableId: BlueprintNodeId) =>
  getVariableControl(state, variableId).value

/**
 * Return wire waypoints and their respective node rects for the given variable.
 */
export const getVariableWireWaypoints = (state: BlueprintState, variableId: BlueprintNodeId) => {
  const variable = getVariableNode(state, variableId)
  const contextProgramId = variable.parentId
  const waypoints: {
    push: boolean,
    x: number,
    y: number,
    nodeX: number,
    nodeY: number,
    nodeWidth: number,
    nodeHeight: number,
  }[] = []

  for (let i = 0; i < variable.attachmentIds.length; i++) {
    const control = getControlNode(state, variable.attachmentIds[i])
    if (control.parentId === contextProgramId) {
      // Stand-alone program control node
      if (
        control.x !== undefined &&
        control.y !== undefined &&
        control.width !== undefined &&
        control.height !== undefined
      ) {
        waypoints.push({
          push: i === 0,
          x: control.x + control.width * 0.5,
          y: control.y + control.height + 0.5,
          nodeX: control.x,
          nodeY: control.y,
          nodeWidth: control.width,
          nodeHeight: control.height,
        })
      }
    } else {
      // Control node embedded in an operation or program node
      const node = getNode(state, control.parentId)
      if (
        node.x !== undefined &&
        node.y !== undefined &&
        node.width !== undefined &&
        node.height !== undefined &&
        control.operationOutletX !== undefined &&
        control.operationOutletY !== undefined
      ) {
        waypoints.push({
          push: i === 0,
          x: node.x + control.operationOutletX,
          y: node.y + control.operationOutletY,
          nodeX: node.x,
          nodeY: node.y,
          nodeWidth: node.width,
          nodeHeight: node.height,
        })
      }
    }
  }

  return waypoints
}
