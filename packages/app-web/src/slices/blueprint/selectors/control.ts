
import {
  compareSerializedValues,
  ControlNode,
  identifySerializedValueType,
  isTypeCompatibleToValueTypes,
  previewMaskedSerializedValue,
  previewSerializedValue,
  roundRect,
  SerializedValue
} from '@ciphereditor/library'
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { ControlNodeState } from '../types/control'
import { VariableNodeState } from '../types/variable'
import { getNode, getNodeChildren, getNodePosition } from './blueprint'
import { getProgramVariables, getVariableControl } from './variable'
import { mapNamedObjects } from '../../../lib/utils/map'

/**
 * Find a control node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Control node
 */
export const getControlNode = (
  state: BlueprintState,
  id: BlueprintNodeId
): ControlNodeState =>
  getNode(state, id, BlueprintNodeType.Control) as ControlNodeState

/**
 * Get an object mapping control names to control nodes.
 */
export const getNodeNamedControls = (
  state: BlueprintState,
  nodeId: BlueprintNodeId
): Record<string, ControlNodeState> =>
  mapNamedObjects(getNodeChildren(
    state, nodeId, BlueprintNodeType.Control) as ControlNodeState[])

/**
 * Return an object mapping control names to values, embedded in the given node.
 */
export const getNodeControlValues = (
  state: BlueprintState,
  nodeId: BlueprintNodeId
): Record<string, SerializedValue> => {
  const controls = getNodeChildren(state, nodeId, BlueprintNodeType.Control) as ControlNodeState[]
  const namedValues: Record<string, SerializedValue> = {}
  for (let i = 0; i < controls.length; i++) {
    namedValues[controls[i].name] = controls[i].value
  }
  return namedValues
}

/**
 * Get the given control's outlet position on canvas
 */
export const getOutletPosition = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  outward: boolean
): { x: number, y: number } | undefined => {
  const control = getControlNode(state, controlId)
  const node = outward ? getNode(state, control.parentId) : control
  const nodePosition = getNodePosition(state, node.id)
  if (
    nodePosition !== undefined &&
    control.nodeOutletX !== undefined &&
    control.nodeOutletY !== undefined
  ) {
    return {
      x: nodePosition.x + control.nodeOutletX,
      y: nodePosition.y + control.nodeOutletY
    }
  }
  return undefined
}

export const getControlProgramId = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  outward: boolean = false
): BlueprintNodeId => {
  const control = getControlNode(state, controlId)
  const parent = getNode(state, control.parentId)

  if (parent.type === BlueprintNodeType.Operation) {
    // The program of an operation control is always the parent of the operation
    return parent.parentId
  }

  // If the parent is not an operation, assume it to be a program
  return outward ? parent.parentId : parent.id
}

/**
 * Return an array of variable nodes that may be attached to the given control
 * within a program context.
 */
export const getControlVariableOptions = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  outward: boolean
): {
  pushOptions: VariableNodeState[]
  pullOptions: VariableNodeState[]
} => {
  const programId = getControlProgramId(state, controlId, outward)
  const variables = getProgramVariables(state, programId)

  const pushOptions: VariableNodeState[] = []
  const pullOptions: VariableNodeState[] = []

  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i]
    const variableControl = getVariableControl(state, variable.id)

    if (canAttachControls(state, variableControl.id, controlId, outward)) {
      pullOptions.push(variable)
    }

    if (variableControl.id === controlId ||
        canAttachControls(state, controlId, variableControl.id, outward)) {
      pushOptions.push(variable)
    }
  }

  return { pushOptions, pullOptions }
}

/**
 * Return wether a control can be attached to another control.
 */
export const canAttachControls = (
  state: BlueprintState,
  sourceControlId: BlueprintNodeId,
  targetControlId: BlueprintNodeId,
  outward: boolean
): boolean => {
  const sourceControl = getControlNode(state, sourceControlId)
  const targetControl = getControlNode(state, targetControlId)

  // TODO: Make sure the variable is not already connected with the operation

  // A control can't connect to itself
  if (sourceControl.id === targetControl.id) {
    return false
  }

  // A control can't connect to a control in the same operation
  if (outward && sourceControl.parentId === targetControl.parentId) {
    return false
  }

  // Check if target is writable
  if (!targetControl.writable) {
    return false
  }

  // Check if source value type is within the value types supported by the target
  const sourceType = identifySerializedValueType(sourceControl.value)
  if (!isTypeCompatibleToValueTypes(sourceType, targetControl.types)) {
    return false
  }

  // Check if the source value is a valid choice among the target choices
  if (targetControl.enforceOptions && targetControl.options.length > 0) {
    if (targetControl.options.find(option => compareSerializedValues(option.value, sourceControl.value)) === undefined) {
      return false
    }
  }

  return true
}

/**
 * Compose a value preview string for the given control.
 */
export const getControlPreview = (
  state: BlueprintState,
  controlId: BlueprintNodeId
): string | undefined => {
  const control = getControlNode(state, controlId)
  if (control.selectedOptionIndex !== undefined) {
    return control.options[control.selectedOptionIndex].label ??
      previewSerializedValue(control.value)
  }
  if (!control.maskPreview) {
    return previewSerializedValue(control.value)
  } else {
    return previewMaskedSerializedValue(control.value)
  }
}

/**
 * Export a control from the blueprint state to a JSON serializable object.
 * The resulting object may be extracted using `addControlNode`.
 * @param state Blueprint state slice
 * @param controlId Id of the control node to be serialized
 * @returns JSON serializable object representing the control node
 */
export const serializeControl = (
  state: BlueprintState,
  controlId: BlueprintNodeId
): ControlNode => {
  const control = getControlNode(state, controlId)
  const serializedControl: ControlNode = {
    type: 'control',
    id: control.id.toString(),
    label: control.label,
    value: control.value,
    visibility: control.visibility,
    frame: control.frame !== undefined ? roundRect(control.frame) : undefined
  }
  return serializedControl
}
