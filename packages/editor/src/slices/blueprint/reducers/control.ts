
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { Control } from 'cryptii-types'
import { ControlChange, ControlChangeSource, ControlNode, ControlViewState } from '../types/control'
import { OperationNode, OperationState } from '../types/operation'
import { addNode, nextNodeId } from './blueprint'
import { addVariable, propagateChange } from './variable'
import { allValueTypes, equalValues, createValue, defaultValue, castValue, resolveImplicitTypedValue, resolveLabeledImplicitTypedValue } from './value'
import { arrayUniqueUnshift } from 'utils/array'
import { capitalCase } from 'change-case'
import { deriveUniqueName } from 'utils/string'
import { getControlNode } from '../selectors/control'
import { getNode, getNodeChildren } from '../selectors/blueprint'
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
  label: 'Control',
  types: allValueTypes,
  value: defaultValue,
  choices: [],
  enforceChoices: true,
  viewState: ControlViewState.Collapsed,
  enabled: true,
  writable: true,
  order: 0
}

/**
 * Add an empty control to the given program node id.
 * @param state Blueprint state
 * @param programId Program node id
 * @param control Control to be added
 * @returns New control node
 */
export const addControlNode = (
  state: BlueprintState,
  programId: BlueprintNodeId,
  x: number,
  y: number,
  label?: string
): ControlNode => {
  const id = nextNodeId(state)

  // Choose unique control label
  const controls = getNodeChildren(state, programId, BlueprintNodeType.Control) as ControlNode[]
  const usedLabels = controls.map(control => control.label)
  const uniqueLabel = deriveUniqueName(label ?? defaultControlNode.label, usedLabels)

  const controlNode: ControlNode = {
    ...defaultControlNode,
    parentId: programId,
    id,
    name: `control${id}`,
    label: uniqueLabel,
    x,
    y
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
): ControlNode => {
  const value = resolveImplicitTypedValue(control.initialValue)
  const choices = control.choices?.map(resolveLabeledImplicitTypedValue) ?? []
  const index = choices.findIndex(x => equalValues(x.value, value))
  const selectedChoiceIndex = index !== -1 ? index : undefined
  const controlNode: ControlNode = {
    ...defaultControlNode,
    ...control,
    id: nextNodeId(state),
    parentId: operationId,
    label: control.label ?? capitalCase(control.name),
    value,
    selectedChoiceIndex,
    choices
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
  sourceVariableId?: BlueprintNodeId
): void => {
  const control = getControlNode(state, controlId)

  // Apply changes not related to the value
  control.label = change.label ?? control.label
  control.enabled = change.enabled ?? control.enabled
  control.order = change.order ?? control.order

  if (change.choices !== undefined) {
    control.choices = change.choices?.map(resolveLabeledImplicitTypedValue) ?? []
  }

  const oldValue = control.value
  const newValue =
    change.value !== undefined
      ? resolveImplicitTypedValue(change.value)
      : oldValue
  const equal = equalValues(oldValue, newValue)

  // If a choice is selected, update it when choices or value change
  if (control.selectedChoiceIndex !== undefined && (change.choices !== undefined || !equal)) {
    const index = control.choices.findIndex(x => equalValues(x.value, newValue))
    control.selectedChoiceIndex = index !== -1 ? index : undefined
  }

  // Bail out early, if the value doesn't change
  if (equal) {
    return
  }

  // Update value
  control.value = newValue

  let operation: OperationNode
  const parent = getNode(state, control.parentId)
  switch (parent.type) {
    case BlueprintNodeType.Operation:
      operation = parent as OperationNode
      if (source !== ControlChangeSource.Parent) {
        // Change is not originating from the operation, so mark it busy
        setOperationState(state, operation.id, OperationState.Busy)
        // Increment the request version every time a control changes
        if (operation.requestVersion !== undefined) {
          operation.requestVersion += 1
        }
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
  choiceIndex: number
): void => {
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
  valueType: string
): void => {
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
  programId: BlueprintNodeId
): void => {
  // TODO: Detach currently attached variable
  addVariable(state, programId, controlId)
}
