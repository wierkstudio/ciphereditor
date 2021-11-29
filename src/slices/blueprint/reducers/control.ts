
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { Control, ControlChange, ControlChangeSource, ControlNode } from 'types/control'
import { OperationNode, OperationState } from 'types/operation'
import { arrayUniqueUnshift } from 'utils/array'
import { getNode } from '../selectors/blueprint'
import { getControlNode } from '../selectors/control'
import { addNode, nextNodeId } from './blueprint'
import { setOperationState } from './operation'
import { compareValues, resolveImplicitTypedValue } from './value'

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
  enum: [],
  enumStrict: true,
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
) => {
  const control = getControlNode(state, controlId)

  // Apply changes not related to the value
  control.label = change.label || control.label
  control.enum = change.enum || control.enum
  control.enabled = change.enabled || control.enabled

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
      break

    case BlueprintNodeType.Program:
      // TODO: What happens when a program control changes?
      break
  }

  // TODO: Propagate value through attached variables
}
