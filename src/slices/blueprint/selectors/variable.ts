
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from 'types/blueprint'
import { VariableNode } from 'types/variable'
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
  variableId: BlueprintNodeId
) => {
  const variable = getVariableNode(state, variableId)
  // TODO: Assertion: A variable is always attached to at least one control
  // Assertion: Variable attachment ids are ordered by when they propagated
  return getControlNode(state, variable.attachmentIds[0]!)
}

/**
 * Return the current value for the given variable.
 */
export const getVariableValue = (state: BlueprintState, variableId: BlueprintNodeId) =>
  getVariableControl(state, variableId).value
