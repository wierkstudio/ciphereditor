
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { Operation, OperationNode, OperationState } from '../types/operation'
import { arrayRemove, arrayUniquePush } from 'utils/array'
import { addNode, nextNodeId } from './blueprint'
import { addOperationControlNode } from './control'

/**
 * Add an operation node to the given program.
 * @param state Blueprint state
 * @param programId Program node id
 * @param operation Operation to be added
 * @returns New operation node
 */
export const addOperationNode = (
  state: BlueprintState,
  programId: BlueprintNodeId,
  operation: Operation,
  x: number,
  y: number,
) => {
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
    x,
    y,
  }

  addNode(state, operationNode)

  // Add operation controls
  operationNode.childIds =
    operation.controls
      .map(addOperationControlNode.bind(null, state, operationNode.id))
      .map(node => node.id)

  // Set initial priority to control order
  operationNode.priorityControlIds = operationNode.childIds.slice()

  return operationNode
}

export const setOperationState = (
  state: BlueprintState,
  operation: OperationNode,
  newState: OperationState
) => {
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
