
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { Control, ControlChange, ControlChangeSource, ControlNode, ControlOption } from 'types/control'
import { OperationNode, OperationState } from 'types/operation'
import { ImplicitTypedValue } from 'types/value'
import { arrayUniqueUnshift } from 'utils/array'
import { getNode } from '../selectors/blueprint'
import { getControlNode } from '../selectors/control'
import { addNode, nextNodeId } from './blueprint'
import { setOperationState } from './operation'
import { compareValues, resolveImplicitTypedValue } from './value'
import { propagateChange } from './variables'

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
  types: ['text'],
  initialValue: '',
  value: { value: '', type: 'text' },
  options: [],
  enforceOptions: true,
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
  const controlNode: ControlNode = {
    ...defaultControlNode,
    ...control,
    id: nextNodeId(state),
    parentId: operationId,
    label: control.label || control.name,
    value: resolveImplicitTypedValue(control.initialValue),
    options:
      control.options !== undefined
        ? resolveImplicitTypedControlOptions(control.options)
        : []
  }
  return addNode(state, controlNode)
}

/**
 * Apply operation control changes.
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

  if (change.options !== undefined) {
    control.options = resolveImplicitTypedControlOptions(change.options)
  }

  // Bail out early, if the value is not part of the change
  if (change.value === undefined) {
    return
  }

  // Bail out early, if the new value is considered equal to the old one
  const oldValue = control.value
  const newValue = resolveImplicitTypedValue(change.value)
  if (compareValues(oldValue, newValue)) {
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
 * Resolve implicit typed control options
 */
 export const resolveImplicitTypedControlOptions = (
  options: ControlOption<ImplicitTypedValue>[]
) => {
  return options.map(option => ({
    ...option,
    value: resolveImplicitTypedValue(option.value),
  }))
}
