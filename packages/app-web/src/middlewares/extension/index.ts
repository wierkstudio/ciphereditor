
import { AnyAction, Middleware } from 'redux'
import { BlueprintNodeId, BlueprintState } from '../../slices/blueprint/types/blueprint'
import { ControlNodeChange } from '../../slices/blueprint/types/control'
import { OperationIssue, OperationResult, serializeValue } from '@ciphereditor/library'
import { RootState } from '../../slices'
import { applyOperationResultAction } from '../../slices/blueprint'
import { getBusyOperationIds, getOpenOperationRequest, getOperationNode } from '../../slices/blueprint/selectors/operation'
import { getContributionInstance } from './extension'
import { getNodeNamedControls } from '../../slices/blueprint/selectors/control'
import { hasNode } from '../../slices/blueprint/selectors/blueprint'

/**
 * Redux middleware collecting operations that become busy after dispatching an
 * action and trigger their executions asynchronously. It is this middleware
 * that facilitates the content flow within a blueprint.
 */
export const extensionMiddleware: Middleware<{}, RootState> = store => {
  return next => (action: AnyAction) => {
    // Dispatch action as usual tracking the state beforehand and afterwards
    const preState = store.getState()
    const result = next(action)
    const postState = store.getState()

    // Trigger executions for operations that were marked busy during an action
    const preBusyIds = getBusyOperationIds(preState.blueprint.present)
    const postBusyIds = getBusyOperationIds(postState.blueprint.present)
    for (const id of postBusyIds) {
      if (!preBusyIds.includes(id)) {
        // The execution itself is async and will announce the result with
        // a separately dispatched action, we don't wait for the Promise here
        void executeOperation(store, id)
      }
    }

    // Return the original result
    return result
  }
}

/**
 * Run the current task of the given operation asynchronously in the processor
 * and dispatch an action once a result is available.
 */
const executeOperation = async (
  store: any,
  operationId: BlueprintNodeId
): Promise<void> => {
  const state: BlueprintState = store.getState().blueprint.present

  // Retrieve open operation request
  const request = getOpenOperationRequest(state, operationId)
  if (request === undefined) {
    // Operation is no longer busy or has been removed
    return
  }

  // Retrieve request context
  const operation = getOperationNode(state, operationId)
  const namedControls = getNodeNamedControls(state, operationId)

  // Try to process the operation request in the processor and await its result
  let result: OperationResult
  try {
    const contributionName = operation.name
    const instance = await getContributionInstance(operation.name, operation.extensionUrl)

    const contributionType: string = instance.exports.contribution.type
    if (contributionType !== 'operation') {
      throw new Error(`Contribution ${contributionName} was expected to be of type operation but found ${contributionType}`)
    }

    // Execute the operation
    instance.worker.setNextFunctionPointerCallTimeout(operation.timeout)
    result = await instance.exports.body.execute(request)
  } catch (error: any) {
    result = {
      issues: [{
        level: 'error',
        message: 'An unexpected error occurred',
        description: error.toString()
      }]
    }
  }

  // TODO: How to handle changes and/or issues targeting disabled controls

  // Validate the result and gather issues
  const resultErrors: OperationIssue[] = []
  const resultChanges: ControlNodeChange[] = []
  const resultChangeControlIds: BlueprintNodeId[] = []

  for (const change of result.changes ?? []) {
    // Identify the target control
    const control = namedControls[change.name]
    if (control !== undefined) {
      // Serialize the change object to a control change object
      const { name, value, ...remainingChanges } = change
      const serializedChange: ControlNodeChange = {
        sourceNodeId: operation.id,
        ...remainingChanges,
        value: value !== undefined ? serializeValue(value) : undefined
      }
      resultChanges.push(serializedChange)
      resultChangeControlIds.push(control.id)
    } else {
      resultErrors.push({
        level: 'error',
        message: 'Received an unexpected result',
        description:
          `A change for an unknown control named '${String(change.name)}' was received.`
      })
    }
  }

  // Validate control references in issues
  for (const issue of result.issues ?? []) {
    if (issue.targetControlNames !== undefined) {
      for (const targetControlName of issue.targetControlNames) {
        if (namedControls[targetControlName] === undefined) {
          resultErrors.push({
            level: 'error',
            message: 'Received an unexpected result',
            description:
              `An issue of type '${String(issue.level)}' for an unknown control ` +
              `named '${String(targetControlName)}' was received.`
          })
        }
      }
    }
  }

  // Dispatch action to propagate operation task result
  if (resultErrors.length === 0) {
    store.dispatch(applyOperationResultAction({
      operationId,
      requestVersion: operation.requestVersion ?? 0,
      changes: resultChanges,
      changeControlIds: resultChangeControlIds,
      issues: result.issues ?? []
    }))
  } else {
    store.dispatch(applyOperationResultAction({
      operationId,
      requestVersion: operation.requestVersion ?? 0,
      changes: [],
      changeControlIds: [],
      issues: resultErrors
    }))
  }

  // If the operation stays busy after dispatching the task result, we need to
  // repeat the process as control values seem to have changed in the meantime
  const postState: BlueprintState = store.getState().blueprint.present
  if (hasNode(postState, operationId)) {
    const postOperation = getOperationNode(postState, operationId)
    if (postOperation.state === 'busy') {
      // Controls changed in the meantime, start from scratch
      void executeOperation(store, operationId)
    }
  }
}
