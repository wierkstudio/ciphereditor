
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { ControlNodeState } from '../types/control'
import { DirectoryState } from '../../directory/types'
import { OperationIssue, OperationNode } from '@ciphereditor/library'
import { OperationNodeState, OperationExecutionState } from '../types/operation'
import { addChildNode, nextNodeId } from './blueprint'
import { addOperationControlNode } from './control'
import { arrayRemove, arrayUniquePush } from '../../../lib/utils/array'
import { capitalCase } from 'change-case'
import { getNextProgramChildFrame } from '../selectors/program'
import { getNode } from '../selectors/blueprint'
import { getOperationContribution } from '../../directory/selectors'
import { getOperationNode } from '../selectors/operation'

// TODO: Move to a constants file
const maxOperationTimeout = 5 * 60 * 1000
const defaultOperationTimeout = 10 * 1000

/**
 * Add the given operation to a program.
 * @param state Blueprint state
 * @param operationNode Operation to be added
 * @param programId Program the node should be added to
 * @param directory Directory state to retrieve operation contribution meta data from
 * @param refIdMap Object mapping node ids to ids in the blueprint state
 */
export const addOperationNode = (
  state: BlueprintState,
  operationNode: OperationNode,
  programId: BlueprintNodeId,
  directory?: DirectoryState,
  refIdMap?: Record<string, BlueprintNodeId>
): OperationNodeState => {
  const operationContribution =
    directory !== undefined
      ? getOperationContribution(directory, operationNode.name)
      : undefined

  if (operationContribution === undefined) {
    // TODO: Needs implementation: Placeholder operation nodes
    throw new Error('Needs implementation: Placeholder operation nodes')
  }

  const frame = operationNode.frame ?? getNextProgramChildFrame(state, programId)

  const operation: OperationNodeState = {
    type: BlueprintNodeType.Operation,
    id: nextNodeId(state),
    parentId: programId,
    name: operationContribution.name,
    label: operationContribution.label ?? capitalCase(operationContribution.name),
    childIds: [],
    reproducible: operationContribution.reproducible !== false,
    state: operationNode.initialExecution === true
      ? OperationExecutionState.Busy
      : OperationExecutionState.Ready,
    requestVersion: operationNode.initialExecution === true
      ? 0
      : undefined,
    issues: [],
    priorityControlIds: [],
    extensionUrl: operationContribution.extensionUrl,
    frame,
    timeout: operationContribution.timeout !== undefined
      ? Math.max(Math.min(operationContribution.timeout, maxOperationTimeout), 0)
      : defaultOperationTimeout
  }

  addChildNode(state, operation)

  const nameControlMap: Record<string, ControlNodeState> = {}
  const controls = operationContribution.controls.map(controlContribution => {
    const overrides = operationNode.controls?.[controlContribution.name]
    const control = addOperationControlNode(
      state, operation.id, controlContribution, overrides?.value)
    if (overrides !== undefined) {
      if (refIdMap !== undefined && overrides.id !== undefined) {
        refIdMap[overrides.id] = control.id
      }
      control.visibility = overrides.visibility ?? control.visibility
    }
    nameControlMap[control.name] = control
    return control
  })

  operation.childIds = controls.map(node => node.id)

  // TODO: Use stable sort here
  controls.sort((a, b) =>
    (operationNode.priorityControlNames?.indexOf(b.name) ?? -1) -
    (operationNode.priorityControlNames?.indexOf(a.name) ?? -1))

  operation.priorityControlIds = operation.childIds.slice()
  return operation
}

export const setOperationState = (
  state: BlueprintState,
  operationId: BlueprintNodeId,
  newState: OperationExecutionState,
  issues?: OperationIssue[]
): void => {
  const operation = getOperationNode(state, operationId)
  if (operation.state === newState) {
    return
  }
  operation.state = newState
  operation.issues = issues ?? []
  switch (newState) {
    case OperationExecutionState.Ready: {
      state.busyOperationIds = arrayRemove(state.busyOperationIds, operation.id)
      delete operation.requestVersion
      break
    }
    case OperationExecutionState.Busy: {
      state.busyOperationIds = arrayUniquePush(state.busyOperationIds, operation.id)
      operation.requestVersion = 0
      break
    }
    case OperationExecutionState.Error: {
      state.busyOperationIds = arrayRemove(state.busyOperationIds, operation.id)
      delete operation.requestVersion
      break
    }
  }
}

export const executeOperation = (state: BlueprintState, nodeId: BlueprintNodeId): void => {
  const node = getNode(state, nodeId)
  // TODO: Handle retry/execute on programs
  if (node.type === BlueprintNodeType.Operation) {
    if ((node as OperationNodeState).state !== OperationExecutionState.Busy) {
      // Mark operation as busy to repeat operation request
      setOperationState(state, nodeId, OperationExecutionState.Busy)
    }
  }
}
