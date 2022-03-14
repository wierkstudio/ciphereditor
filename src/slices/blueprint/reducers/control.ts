
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { Control, ControlChange, ControlChangeSource, ControlNode, ControlValueChoice, ControlViewState } from '../types/control'
import { ImplicitTypedValue } from '../types/value'
import { OperationNode, OperationState } from '../types/operation'
import { addNode, nextNodeId } from './blueprint'
import { addVariable, propagateChange } from './variable'
import { allValueTypes, compareValues, createValue, defaultValue, castValue, resolveImplicitTypedValue } from './value'
import { arrayUniqueUnshift } from 'utils/array'
import { capitalCase } from 'change-case'
import { getControlNode } from '../selectors/control'
import { getNode } from '../selectors/blueprint'
import { setOperationState } from './operation'

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
  viewState: ControlViewState.Collapsed,
  enabled: true,
  writable: true,
  x: 0,
  y: 0,
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
    label: control.label || capitalCase(control.name),
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
          // Propagate change outside the program (if not root)
          if (state.rootProgramId !== parent.id) {
            propagateChange(state, control.id, parent.parentId)
          }
        } else {
          // Propagate change inside the program
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
  choiceIndex: number,
) => {
  const control = getControlNode(state, controlId)
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
  valueType: string,
) => {
  const control = getControlNode(state, controlId)
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
 * Add a new variable from a control.
 */
export const addVariableFromControl = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId: BlueprintNodeId,
) => {
  // TODO: Detach currently attached variable
  addVariable(state, programId, controlId)
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
