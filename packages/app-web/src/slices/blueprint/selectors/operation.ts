
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { ControlNode } from '../types/control'
import { OperationNode, OperationState } from '../types/operation'
import { extractValue, OperationIssue, OperationRequest, Value } from '@ciphereditor/library'
import { getControlNode, getNodeControlValues } from './control'
import { getNode, hasNode } from './blueprint'

/**
 * Find a variable node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Operation node
 */
export const getOperationNode = (state: BlueprintState, id: BlueprintNodeId): OperationNode =>
  getNode(state, id, BlueprintNodeType.Operation) as OperationNode

/**
 * Return node ids of operations that are currently busy.
 */
export const getBusyOperationIds = (state: BlueprintState): number[] =>
  state.busyOperationIds

/**
 * Compose the current open operation request for the given operation node
 * @returns An operation request or undefined if the specified node does not
 * exist or if there is no open request available for it
 */
export const getOpenOperationRequest = (
  state: BlueprintState,
  operationId: BlueprintNodeId
): OperationRequest | undefined => {
  if (!hasNode(state, operationId)) {
    return undefined
  }
  const operation = getOperationNode(state, operationId)
  if (operation.state !== OperationState.Busy) {
    return undefined
  }

  // Prepare values by extracting them
  const serializedValues = getNodeControlValues(state, operation.id)
  const values: Record<string, Value> = {}
  for (const key in serializedValues) {
    values[key] = extractValue(serializedValues[key])
  }

  // Retrieve control priorities
  const controlPriorities =
    operation.priorityControlIds
      .map(id => getControlNode(state, id).name)

  return { values, controlPriorities }
}

/**
 * Return operation issues referencing the given node.
 */
export const getOperationIssues = (
  state: BlueprintState,
  nodeId: BlueprintNodeId
): OperationIssue[] => {
  const node = getNode(state, nodeId)
  let control: ControlNode, parentNode
  switch (node.type) {
    // TODO: Include programs here
    case BlueprintNodeType.Operation:
      return (node as OperationNode).issues
    case BlueprintNodeType.Control:
      control = node as ControlNode
      parentNode = getNode(state, node.parentId)
      if (parentNode.type === BlueprintNodeType.Operation) {
        const operationIssues = getOperationIssues(state, parentNode.id)
        return operationIssues.filter(issue =>
          issue.targetControlNames?.includes(control.name))
      }
  }
  return []
}
