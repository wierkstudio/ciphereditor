
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from '../types/blueprint'
import { ControlNode } from '../types/control'
import { TypedValue } from '../types/value'
import { VariableNode } from '../types/variable'
import { mapNamedObjects } from 'utils/map'
import { isTypeWithinTypes, previewValue } from '../reducers/value'
import { getNode, getNodeChildren } from './blueprint'
import { getProgramVariables, getVariableValue } from './variable'

/**
 * Find a control node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Control node
 */
export const getControlNode = (state: BlueprintState, id: BlueprintNodeId) =>
  getNode(state, id, BlueprintNodeType.Control) as ControlNode

/**
 * Get an object mapping control names to control nodes.
 */
export const getNodeNamedControls = (state: BlueprintState, nodeId: BlueprintNodeId) =>
  mapNamedObjects(getNodeChildren(
    state, nodeId, BlueprintNodeType.Control) as ControlNode[])

/**
 * Return an object mapping control names to values, embedded in the given node.
 */
export const getNodeControlValues = (state: BlueprintState, nodeId: BlueprintNodeId) => {
  const controls = getNodeChildren(state, nodeId, BlueprintNodeType.Control) as ControlNode[]
  const namedValues: { [name: string]: TypedValue } = {}
  for (let i = 0; i < controls.length; i++) {
    namedValues[controls[i].name] = controls[i].value
  }
  return namedValues
}

/**
 * Get the control node currently marked as linked.
 */
export const getLinkControl = (state: BlueprintState) =>
  state.linkControlId ? getControlNode(state, state.linkControlId) : undefined

/**
 * For the given control and program context decide wether the intern control
 * variable should be used. By default, the active program context is used.
 */
export const isControlInternVariable = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId?: BlueprintNodeId,
) => {
  const control = getControlNode(state, controlId)
  return (programId ?? state.activeProgramId) === control.parentId
}

/**
 * Return an array of variable nodes that may be attached to the given control
 * within a program context.
 */
export const getControlVariableOptions = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId: BlueprintNodeId,
) => {
  const control = getControlNode(state, controlId)
  const variables = getProgramVariables(state, programId)

  const pushOptions: VariableNode[] = []
  const pullOptions: VariableNode[] = []

  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i]
    const variableValue = getVariableValue(state, variable.id)

    // For the user to be able to pull from a variable, the variable's value
    // type needs to be among the control types
    if (isTypeWithinTypes(variableValue.type, control.types)) {
      pullOptions.push(variable)
    }

    // A user may always push to a variable
    // TODO: Make sure the variable is not already connected with the operation
    pushOptions.push(variable)
  }

  return { pushOptions, pullOptions }
}

/**
 * Compose a value preview string for the given control.
 */
export const getControlPreview = (
  state: BlueprintState,
  controlId: BlueprintNodeId
): string|undefined => {
  const control = getControlNode(state, controlId)
  if (control.selectedChoiceIndex !== undefined) {
    return control.choices[control.selectedChoiceIndex].label
  }
  return previewValue(control.value)
}
