
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { Control, ControlChange, ControlChangeSource, ControlNode, ControlValueChoice } from 'types/control'
import { OperationNode, OperationState } from 'types/operation'
import { ImplicitTypedValue } from 'types/value'
import { arrayUniqueUnshift } from 'utils/array'
import { getNode } from '../selectors/blueprint'
import { getControlNode, isControlInternVariable } from '../selectors/control'
import { getControlVariable, getVariableControl, getVariableNode } from '../selectors/variable'
import { addNode, nextNodeId } from './blueprint'
import { setOperationState } from './operation'
import { allValueTypes, compareValues, createValue, defaultValue, castValue, resolveImplicitTypedValue } from './value'
import { addVariable, attachControlToVariable, detachControlFromVariable, propagateChange } from './variable'

/**
 * Default control node object
 */
export const defaultControlNode: ControlNode = {
  id: -1,
  type: BlueprintNodeType.Control,
  parentId: -1,
  childIds: [],
  name: '',
  label: '',
  types: allValueTypes,
  value: defaultValue,
  choices: [],
  enforceChoices: true,
  enabled: true,
  writable: true,
}

/**
 * Add an empty control to the given program node id.
 * @param state Blueprint state
 * @param programId Program node id
 * @param control Control to be added
 * @returns New control node
 */
export const addProgramControlNode = (
   state: BlueprintState,
   programId: BlueprintNodeId
) => {
  const id = nextNodeId(state)
  const controlNode: ControlNode = {
    ...defaultControlNode,
    parentId: programId,
    id,
    name: `control${id}`,
    label: `Control ${id}`,
  }
  return addNode(state, controlNode)
}

/**
 * Add a control to the given operation node id.
 * @param state Blueprint state
 * @param operationId Operation node id
 * @param control Control to be added
 * @returns New control node
 */
export const addOperationControlNode = (
  state: BlueprintState,
  operationId: BlueprintNodeId,
  control: Control
) => {
  const value = resolveImplicitTypedValue(control.initialValue)
  const choices = resolveImplicitTypedControlValueChoices(control.choices)
  const index = choices.findIndex(x => compareValues(x.value, value))
  const selectedChoiceIndex = index !== -1 ? index : undefined
  const controlNode: ControlNode = {
    ...defaultControlNode,
    ...control,
    id: nextNodeId(state),
    parentId: operationId,
    label: control.label || control.name,
    value,
    selectedChoiceIndex,
    choices,
  }
  return addNode(state, controlNode)
}

/**
 * Apply control changes originating from the user, an operation or a variable.
 */
export const changeControl = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  change: ControlChange,
  source: ControlChangeSource,
  sourceVariableId?: BlueprintNodeId,
) => {
  const control = getControlNode(state, controlId)

  // Apply changes not related to the value
  control.label = change.label || control.label
  control.enabled = change.enabled || control.enabled

  if (change.choices !== undefined) {
    control.choices = resolveImplicitTypedControlValueChoices(change.choices)
  }

  const oldValue = control.value
  const newValue =
    change.value !== undefined
      ? resolveImplicitTypedValue(change.value)
      : oldValue
  const equal = compareValues(oldValue, newValue)

  // If a choice is selected, update it when choices or value change
  if (control.selectedChoiceIndex !== undefined && (change.choices !== undefined || !equal)) {
    const index = control.choices.findIndex(x => compareValues(x.value, newValue))
    control.selectedChoiceIndex = index !== -1 ? index : undefined
  }

  // Bail out early, if the value doesn't change
  if (equal) {
    return
  }

  // Update value
  control.value = newValue

  const parent = getNode(state, control.parentId)
  switch (parent.type) {
    case BlueprintNodeType.Operation:
      const operation = parent as OperationNode
      if (source !== ControlChangeSource.Parent) {
        // Change is not originating from the operation, so mark it busy
        setOperationState(state, operation, OperationState.Busy)
        // Increment the task version every time a control changes
        operation.taskVersion! += 1
        // Move the control id that was changed last to the head
        operation.priorityControlIds =
          arrayUniqueUnshift(operation.priorityControlIds, control.id)
      }
      if (source !== ControlChangeSource.Variable) {
        propagateChange(state, control.id, parent.parentId)
      }
      break

    case BlueprintNodeType.Program:
      if (source === ControlChangeSource.Variable) {
        if (sourceVariableId === control.attachedInternVariableId) {
          propagateChange(state, control.id, parent.parentId)
        } else {
          propagateChange(state, control.id, parent.id)
        }
      } else if (source === ControlChangeSource.UserInput) {
        propagateChange(state, control.id, parent.parentId)
        propagateChange(state, control.id, parent.id)
      }
      break
  }
}

/**
 * Set a control value to the given choice index.
 */
export const changeControlValueToChoice = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId: BlueprintNodeId,
  choiceIndex: number,
) => {
  const control = getControlNode(state, controlId)
  // Detach from variable, if any
  const attachedVariable = getControlVariable(state, controlId, programId)
  if (attachedVariable !== undefined) {
    detachControlFromVariable(state, controlId, attachedVariable.id)
  }
  // Apply choice
  const value = control.choices[choiceIndex].value
  changeControl(state, controlId, { value }, ControlChangeSource.UserInput)
  control.selectedChoiceIndex = choiceIndex
}

/**
 * Change the type of a control value.
 */
export const changeControlValueToType = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId: BlueprintNodeId,
  valueType: string,
) => {
  const control = getControlNode(state, controlId)
  // Detach from variable, if any
  const attachedVariable = getControlVariable(state, controlId, programId)
  if (attachedVariable !== undefined) {
    detachControlFromVariable(state, controlId, attachedVariable.id)
  }
  // Derive value of desired type from current value
  control.selectedChoiceIndex = undefined
  if (control.value.type !== valueType) {
    let value = castValue(control.value, valueType)
    if (value === undefined) {
      value = createValue(valueType)
    }
    changeControl(state, controlId, { value }, ControlChangeSource.UserInput)
  }
}

/**
 * Change the value of a control to a variable.
 */
export const changeControlValueToVariable = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  variableId: BlueprintNodeId,
) => {
  const control = getControlNode(state, controlId)
  control.selectedChoiceIndex = undefined
  attachControlToVariable(state, controlId, variableId, false)
  // TODO: Choose propagation direction based on control priority
  // Propagate from the last active control to this control
  const variable = getVariableNode(state, variableId)
  const activeControl = getVariableControl(state, variableId)
  propagateChange(state, activeControl.id, variable.parentId)
}

/**
 * Add a new variable from a control.
 */
export const addVariableFromControl = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId: BlueprintNodeId,
) => {
  // TODO: Detach currently attached variable
  const control = getControlNode(state, controlId)
  control.selectedChoiceIndex = undefined
  // Create new variable
  const variable = addVariable(state, programId, controlId)
  // When editing a control from outside also add a program control for
  // this new variable
  if (!isControlInternVariable(state, controlId, programId)) {
    const programControl = addProgramControlNode(state, programId)
    attachControlToVariable(state, programControl.id, variable.id)
  }
  propagateChange(state, controlId, programId)
}

/**
 * Resolve implicit typed control options
 */
export const resolveImplicitTypedControlValueChoices = (
  options: ControlValueChoice<ImplicitTypedValue>[] | undefined
) => {
  if (options === undefined) {
    return []
  }
  return options.map(option => ({
    ...option,
    value: resolveImplicitTypedValue(option.value),
  }))
}
