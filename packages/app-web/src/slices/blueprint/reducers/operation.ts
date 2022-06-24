
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { OperationContribution, OperationIssue } from '@ciphereditor/types'
import { OperationNode, OperationState } from '../types/operation'
import { addNode, nextNodeId } from './blueprint'
import { addOperationControlNode } from './control'
import { arrayRemove, arrayUniquePush } from '../../../utils/array'
import { capitalCase } from 'change-case'
import { getNode } from '../selectors/blueprint'
import { getOperationNode } from '../selectors/operation'

/**
 * Add an operation node to the given program.
 * @param state Blueprint state
 * @param programId Program node id
 * @param operationContribution Operation contribution to be used
 * @returns New operation node
 */
export const addOperationNode = (
  state: BlueprintState,
  programId: BlueprintNodeId,
  operationContribution: OperationContribution,
  x: number,
  y: number
): OperationNode => {
  const operationNode: OperationNode = {
    id: nextNodeId(state),
    parentId: programId,
    type: BlueprintNodeType.Operation,
    contributionName: operationContribution.name,
    label: operationContribution.label ?? capitalCase(operationContribution.name),
    childIds: [],
    state: OperationState.Ready,
    issues: [],
    priorityControlIds: [],
    extensionUrl: operationContribution.extensionUrl,
    x,
    y
  }

  addNode(state, operationNode)

  // Add operation controls
  operationNode.childIds =
  operationContribution.controls
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
