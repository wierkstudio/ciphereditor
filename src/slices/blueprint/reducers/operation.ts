
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { ControlChange, ControlChangeSource, ControlNode } from 'types/control'
import { Operation, OperationNode, OperationState } from 'types/operation'
import { arrayRemove, arrayUniquePush, arrayUniqueUnshift } from 'utils/array'
import { mapNamedObjects } from 'utils/map'
import { getNodeChildren } from '../selectors/blueprint'
import { addNode, nextNodeId } from './blueprint'
import { addOperationControlNode } from './control'
import { compareValues, resolveImplicitTypedValue } from './value'

/**
 * Add an operation node to the given program.
 * @param state Blueprint state
 * @param programId Program node id
 * @param operation Operation to be added
 * @returns New operation node
 */
export const addOperationNode = (state: BlueprintState, programId: BlueprintNodeId, operation: Operation) => {
  // TODO: Where to put the operation entity name
  const operationNode: OperationNode = {
    id: nextNodeId(state),
    parentId: programId,
    type: BlueprintNodeType.Operation,
    label: operation.label,
    childIds: [],
    state: OperationState.Ready,
    priorityControlIds: [],
    bundleUrl: operation.bundleUrl,
    moduleId: operation.moduleId,
  }

  addNode(state, operationNode)

  // Add operation controls
  operationNode.childIds =
    operation.controls
      .map(addOperationControlNode.bind(null, state, operationNode.id))
      .map(node => node.id)

  return operationNode
}

export const changeOperationControls = (
  state: BlueprintState,
  operation: OperationNode,
  changes: ControlChange[],
  changeSource: ControlChangeSource,
) => {
  const namedControls = mapNamedObjects(getNodeChildren(
    state, operation.id, BlueprintNodeType.Control) as ControlNode[])

  changes.forEach(change => {
    const control = namedControls[change.name]

    // Check for value changes
    if (change.value) {
      const newValue = resolveImplicitTypedValue(change.value)
      if (!compareValues(control.value, newValue)) {
        // Raise busy flag on operation if the change is not coming from it
        if (changeSource !== ControlChangeSource.Parent) {
          setOperationState(state, operation, OperationState.Busy)
          operation.taskVersion! += 1

          // Update control priority by which control changed last
          operation.priorityControlIds =
            arrayUniqueUnshift(operation.priorityControlIds, control.id)
        }

        // Update value
        control.value = newValue

        // TODO: Propagate new value
      }
    }

    // Apply other changes
    control.label = change.label || control.label
    control.enum = change.enum || control.enum
    control.enabled = change.enabled || control.enabled

    if (changeSource === ControlChangeSource.Parent) {
      setOperationState(state, operation, OperationState.Ready)
    }
  })
}

export const setOperationState = (state: BlueprintState, operation: OperationNode, newState: OperationState) => {
  if (operation.state === newState) {
    return
  }
  operation.state = newState
  switch (newState) {
    case OperationState.Ready:
      state.busyOperationIds = arrayRemove(state.busyOperationIds, operation.id)
      delete operation.taskVersion
      break

    case OperationState.Busy:
      state.busyOperationIds = arrayUniquePush(state.busyOperationIds, operation.id)
      operation.taskVersion = 0
      break

    case OperationState.Failed:
      state.busyOperationIds = arrayRemove(state.busyOperationIds, operation.id)
      delete operation.taskVersion
      break
  }
}
