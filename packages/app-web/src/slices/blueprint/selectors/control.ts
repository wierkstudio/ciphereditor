
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { ControlNode } from '../types/control'
import { TypedValue } from '@ciphereditor/types'
import { VariableNode } from '../types/variable'
import { equalValues, isTypeWithinTypes, previewValue } from '../reducers/value'
import { getNode, getNodeChildren, getNodePosition } from './blueprint'
import { getProgramVariables, getVariableControl } from './variable'
import { mapNamedObjects } from '../../../lib/utils/map'
import { UICanvasMode } from '../../ui/types'

/**
 * Find a control node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Control node
 */
export const getControlNode = (state: BlueprintState, id: BlueprintNodeId): ControlNode =>
  getNode(state, id, BlueprintNodeType.Control) as ControlNode

/**
 * Get an object mapping control names to control nodes.
 */
export const getNodeNamedControls = (state: BlueprintState, nodeId: BlueprintNodeId): {
  [name: string]: ControlNode
} =>
  mapNamedObjects(getNodeChildren(
    state, nodeId, BlueprintNodeType.Control) as ControlNode[])

/**
 * Return an object mapping control names to values, embedded in the given node.
 */
export const getNodeControlValues = (state: BlueprintState, nodeId: BlueprintNodeId): {
  [name: string]: TypedValue
} => {
  const controls = getNodeChildren(state, nodeId, BlueprintNodeType.Control) as ControlNode[]
  const namedValues: { [name: string]: TypedValue } = {}
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
  contextProgramId: BlueprintNodeId | undefined,
  canvasMode: UICanvasMode = UICanvasMode.Plane
): { x: number, y: number } | undefined => {
  const control = getControlNode(state, controlId)
  const node =
    control.parentId === contextProgramId
      ? control
      : getNode(state, control.parentId)
  const nodePosition = getNodePosition(state, node.id, canvasMode)
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

/**
 * For the given control and program context decide wether the intern control
 * variable should be used. By default, the active program context is used.
 */
export const isControlInternVariable = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId?: BlueprintNodeId
): boolean => {
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
  contextProgramId: BlueprintNodeId
): {
  pushOptions: VariableNode[]
  pullOptions: VariableNode[]
} => {
  const variables = getProgramVariables(state, contextProgramId)

  const pushOptions: VariableNode[] = []
  const pullOptions: VariableNode[] = []

  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i]
    const variableControl = getVariableControl(state, variable.id)

    if (canAttachControls(state, variableControl.id, controlId, contextProgramId)) {
      pullOptions.push(variable)
    }

    if (variableControl.id === controlId ||
        canAttachControls(state, controlId, variableControl.id, contextProgramId)) {
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
  contextProgramId: BlueprintNodeId
): boolean => {
  const sourceControl = getControlNode(state, sourceControlId)
  const targetControl = getControlNode(state, targetControlId)

  // TODO: Make sure the variable is not already connected with the operation

  // A control can't connect to itself
  if (sourceControl.id === targetControl.id) {
    return false
  }

  // A control can't connect to a control in the same operation
  if (sourceControl.parentId === targetControl.parentId && sourceControl.parentId !== contextProgramId) {
    return false
  }

  // Check if target is writable
  if (!targetControl.writable) {
    return false
  }

  // Check if source value type is within the value types supported by the target
  if (!isTypeWithinTypes(sourceControl.value.type, targetControl.types)) {
    return false
  }

  // Check if the source value is a valid choice among the target choices
  if (targetControl.enforceChoices && targetControl.choices.length > 0) {
    if (targetControl.choices.find(choice => equalValues(choice.value, sourceControl.value)) === undefined) {
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
): string|undefined => {
  const control = getControlNode(state, controlId)
  if (control.selectedChoiceIndex !== undefined) {
    return control.choices[control.selectedChoiceIndex].label
  }
  return previewValue(control.value)
}
