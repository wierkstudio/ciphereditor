
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { Operation, OperationIssue, OperationNode, OperationState } from '../types/operation'
import { arrayRemove, arrayUniquePush } from 'utils/array'
import { addNode, nextNodeId } from './blueprint'
import { addOperationControlNode } from './control'
import { getNode } from '../selectors/blueprint'
import { getOperationNode } from '../selectors/operation'

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
  y: number
): OperationNode => {
  // TODO: Where to put the operation entity name
  const operationNode: OperationNode = {
    id: nextNodeId(state),
    parentId: programId,
    type: BlueprintNodeType.Operation,
    label: operation.label,
    childIds: [],
    state: OperationState.Ready,
    issues: [],
    priorityControlIds: [],
    bundleUrl: operation.bundleUrl,
    moduleId: operation.moduleId,
    x,
    y
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
  operationId: BlueprintNodeId,
  newState: OperationState,
  issues?: OperationIssue[]
): void => {
  const operation = getOperationNode(state, operationId)
  if (operation.state === newState) {
    return
  }
  operation.state = newState
  operation.issues = issues ?? []
  switch (newState) {
    case OperationState.Ready:
      state.busyOperationIds = arrayRemove(state.busyOperationIds, operation.id)
      delete operation.requestVersion
      break

    case OperationState.Busy:
      state.busyOperationIds = arrayUniquePush(state.busyOperationIds, operation.id)
      operation.requestVersion = 0
      break

    case OperationState.Error:
      state.busyOperationIds = arrayRemove(state.busyOperationIds, operation.id)
      delete operation.requestVersion
      break
  }
}

export const retryOperation = (state: BlueprintState, nodeId: BlueprintNodeId): void => {
  const node = getNode(state, nodeId)
  // TODO: Handle retry on programs
  if (node.type === BlueprintNodeType.Operation) {
    if ((node as OperationNode).state === OperationState.Error) {
      // Mark operation as busy to repeat operation request
      setOperationState(state, nodeId, OperationState.Busy)
    }
  }
}
