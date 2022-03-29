
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { OperationNode, OperationState } from '../types/operation'
import { TypedValue } from '../types/value'
import { getNode, hasNode } from './blueprint'
import { getControlNode, getNodeControlValues } from './control'

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
 * Gather the data required to execute an operation.
 * @returns A task object or undefined if the specified node does not exist or
 * if there is no task available for it
 */
export const getOperationTask = (state: BlueprintState, operationId: BlueprintNodeId): {
  operation: OperationNode
  version: number
  bundleUrl: string
  moduleId: string
  priorityControlNames: string[]
  namedControlValues: {
    [name: string]: TypedValue
  }
} | undefined => {
  if (!hasNode(state, operationId)) {
    return undefined
  }
  const operation = getOperationNode(state, operationId)
  if (operation.state !== OperationState.Busy) {
    return undefined
  }
  return {
    operation,
    version: operation.taskVersion ?? 0,
    bundleUrl: operation.bundleUrl,
    moduleId: operation.moduleId,
    priorityControlNames:
      operation.priorityControlIds.map(id => getControlNode(state, id).name),
    namedControlValues: getNodeControlValues(state, operation.id)
  }
}
