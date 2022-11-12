
import {
  compareSerializedValues,
  extractValue,
  OperationIssue,
  OperationNode,
  OperationRequest,
  roundRect,
  Value
} from '@ciphereditor/library'
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState
} from '../types/blueprint'
import { ControlNodeState } from '../types/control'
import { DirectoryState } from '../../directory/types'
import { OperationNodeState, OperationExecutionState } from '../types/operation'
import { defaultControlNode } from '../reducers/control'
import { getControlNode, getNodeControlValues } from './control'
import { getNode, getNodeChildren, hasNode } from './blueprint'
import { getOperationContribution } from '../../directory/selectors'
import { serializeVariable } from './variable'

/**
 * Find a variable node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Operation node
 */
export const getOperationNode = (
  state: BlueprintState,
  id: BlueprintNodeId
): OperationNodeState =>
  getNode(state, id, BlueprintNodeType.Operation) as OperationNodeState

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
  if (operation.state !== OperationExecutionState.Busy) {
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
  let control: ControlNodeState, parentNode
  switch (node.type) {
    // TODO: Include programs here
    case BlueprintNodeType.Operation:
      return (node as OperationNodeState).issues
    case BlueprintNodeType.Control:
      control = node as ControlNodeState
      parentNode = getNode(state, node.parentId)
      if (parentNode.type === BlueprintNodeType.Operation) {
        const operationIssues = getOperationIssues(state, parentNode.id)
        return operationIssues.filter(issue =>
          issue.targetControlNames?.includes(control.name))
      }
  }
  return []
}

/**
 * Export an operation from the blueprint state to a JSON serializable object.
 * The resulting object may be extracted using `addOperationNode`.
 * @param state Blueprint state slice
 * @param operationId Id of the operation node to be serialized
 * @param directory Directory state slice used to retrieve operation meta data
 * necessary to serialize the operation
 * @returns JSON serializable object representing the operation node
 */
export const serializeOperation = (
  state: BlueprintState,
  directory: DirectoryState | undefined,
  operationId: BlueprintNodeId
): OperationNode => {
  const operation = getOperationNode(state, operationId)
  const controls = getNodeChildren(state, operationId, BlueprintNodeType.Control) as ControlNodeState[]

  // Find matching operation in the directory
  const directoryOperation = directory !== undefined
    ? getOperationContribution(directory, operation.name)
    : undefined
  if (directoryOperation === undefined) {
    throw new Error(
      'Logic error: Cannot serialize an operation without its contribution')
  }

  // Serialize operation control state
  const serializedControls: OperationNode['controls'] = {}
  for (const control of controls) {
    // Find matching control entity in the directory
    const directoryControl = directoryOperation.controls
      .find(directoryControl => directoryControl.name === control.name)
    if (directoryControl === undefined) {
      throw new Error('Logic error: Cannot find matching control')
    }

    // Prepare serialized control
    const serializedControl: NonNullable<OperationNode['controls']>[string] = {}

    // Include the `id` attribute only when a variable is attached that is
    // serialized, too (i.e. having two or more attachments)
    if (
      control.attachedOutwardVariableId !== undefined &&
      serializeVariable(state, control.attachedOutwardVariableId) !== undefined
    ) {
      serializedControl.id = control.id.toString()
    }

    // Include the `value` attribute only when it differs from the initial
    if (!compareSerializedValues(control.value, directoryControl.value)) {
      serializedControl.value = control.value
    }

    // Include the `visibility` attribute only when it differs from the initial
    const initialVisibility =
      directoryControl.visibility ?? defaultControlNode.visibility
    if (control.visibility !== initialVisibility) {
      serializedControl.visibility = control.visibility
    }

    // Include the control if at least one attribute is set
    if (Object.keys(serializedControl).length > 0) {
      serializedControls[control.name] = serializedControl
    }
  }

  const serializedOperation: OperationNode = {
    type: 'operation',
    name: operation.name,
    extensionUrl: operation.extensionUrl,
    priorityControlNames: operation.priorityControlIds.map(controlId =>
      getControlNode(state, controlId).name),
    frame: roundRect(operation.frame)
  }

  // Enable initial execution if the execution is pending or erroneous
  if (operation.state !== OperationExecutionState.Ready) {
    serializedOperation.initialExecution = true
  }

  // Include controls object if at least one control is added
  if (Object.keys(serializedControls).length > 0) {
    serializedOperation.controls = serializedControls
  }

  return serializedOperation
}
