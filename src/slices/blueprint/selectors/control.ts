
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from 'types/blueprint'
import { ControlNode } from 'types/control'
import { TypedValue } from 'types/value'
import { mapNamedObjects } from 'utils/map'
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
  return getProgramVariables(state, programId).filter(variable => {
    const value = getVariableValue(state, variable.id)
    return control.types.indexOf(value.type) !== -1
  })
}
