
import Processor from 'app/Processor'
import { AnyAction, Middleware } from 'redux'
import { BlueprintNodeId, BlueprintState } from 'slices/blueprint/types/blueprint'
import { operationResultSchema, OperationState } from 'slices/blueprint/types/operation'
import { RootState } from 'slices'
import { getBusyOperationIds, getOpenOperationRequest, getOperationNode } from 'slices/blueprint/selectors/operation'
import { getNodeNamedControls } from 'slices/blueprint/selectors/control'
import { hasNode } from 'slices/blueprint/selectors/blueprint'
import { applyOperationResultAction } from 'slices/blueprint'
import { OperationIssue, OperationResult } from '@cryptii/types'

// TODO: Move this to a better place where it can be configured properly
const processor = new Processor(process.env.REACT_APP_PROCESSOR_URL ?? './processor/')

export const processorMiddleware: Middleware<{}, RootState> = store => next => (action: AnyAction) => {
  const preBusyOperationIds = getBusyOperationIds(store.getState().blueprint.present)
  const result = next(action)
  const postBusyOperationIds = getBusyOperationIds(store.getState().blueprint.present)

  // Trigger operation tasks for operations that were marked busy
  postBusyOperationIds
    .filter(id => !preBusyOperationIds.includes(id))
    .forEach(id => {
      void processOpenOperationRequest(store, id)
    })

  return result
}

/**
 * Run the current task of the given operation asynchronously in the processor
 * and dispatch an action once a result is available.
 */
const processOpenOperationRequest = async (store: any, operationId: BlueprintNodeId): Promise<void> => {
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
    const rawResult: any = await processor.callModuleFunction(
      operation.bundleUrl,
      operation.moduleId,
      'onOperationRequest',
      [request]
    )

    // TODO: Refactor error handling within the processor
    if (typeof rawResult.error !== 'undefined') {
      throw rawResult.error
    }

    // Validate result against schema
    result = operationResultSchema.parse(rawResult)
  } catch (err: any) {
    result = {
      issues: [{
        type: 'error',
        message: 'An unexpected error occurred',
        description: err.toString()
      }]
    }
  }

  // TODO: How to handle changes and/or issues targeting disabled controls

  // Validate the result and gather issues
  const resultErrors: OperationIssue[] = []

  // Validate control references in changes
  if (result.changes !== undefined) {
    for (const change of result.changes) {
      if (namedControls[change.name] === undefined) {
        resultErrors.push({
          type: 'error',
          message: 'Received an unexpected result',
          description:
            `A change for an unknown control named '${change.name}' was received.`
        })
      }
    }
  }

  // Validate control references in issues
  if (result.issues !== undefined) {
    for (const issue of result.issues) {
      if (issue.controlName !== undefined) {
        if (namedControls[issue.controlName] === undefined) {
          resultErrors.push({
            type: 'error',
            message: 'Received an unexpected result',
            description:
              `An issue of type '${issue.type}' for an unknown control ` +
              `named '${issue.controlName}' was received.`
          })
        }
      }
    }
  }

  // Dispatch action to propagate operation task result
  store.dispatch(applyOperationResultAction({
    operationId,
    requestVersion: operation.requestVersion ?? 0,
    request,
    result: resultErrors.length === 0 ? result : { issues: resultErrors }
  }))

  // If the operation stays busy after dispatching the task result, we need to
  // repeat the process as control values seem to have changed in the meantime
  const postState: BlueprintState = store.getState().blueprint.present
  if (hasNode(postState, operationId)) {
    const postOperation = getOperationNode(postState, operationId)
    if (postOperation.state === OperationState.Busy) {
      // Controls changed in the meantime, start from scratch
      void processOpenOperationRequest(store, operationId)
    }
  }
}
