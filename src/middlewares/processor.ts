
import Processor from 'app/Processor'
import { AnyAction, Middleware } from 'redux'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { NamedControlChange } from 'slices/blueprint/types/control'
import { OperationState } from 'slices/blueprint/types/operation'
import { RootState } from 'slices'
import { applyOperationTaskResultAction } from 'slices/blueprint'
import { getBusyOperationIds, getOperationNode, getOperationTask } from 'slices/blueprint/selectors/operation'
import { hasNode } from 'slices/blueprint/selectors/blueprint'

// TODO: Move this to a better place where it can be configured properly
let processor = new Processor('/processor.html')

export const processorMiddleware: Middleware<{}, RootState> = store => next => (action: AnyAction) => {
  const preBusyOperationIds = getBusyOperationIds(store.getState().blueprint.present)
  const result = next(action)
  const postBusyOperationIds = getBusyOperationIds(store.getState().blueprint.present)

  // Trigger operation tasks for operations that were marked busy
  postBusyOperationIds
    .filter(id => preBusyOperationIds.indexOf(id) === -1)
    .forEach(runOperationTask.bind(null, store))

  return result
}

/**
 * Run the current task of the given operation asynchronously in the processor
 * and dispatch an action once a result is available.
 */
const runOperationTask = async (store: any, operationId: BlueprintNodeId) => {
  // Retrieve fresh operation task data
  const state: RootState = store.getState()
  const task = getOperationTask(state.blueprint.present, operationId)
  if (task === undefined) {
    // Operation is no longer busy or has been removed
    return
  }

  // Try to execute the computations in the processor and await its response
  let controlChanges: NamedControlChange[] = []
  let error: string | undefined = undefined
  try {
    // TODO: Validate untrusted module response
    controlChanges = await processor.callModuleFunction(
      task.bundleUrl,
      task.moduleId,
      'onControlChange',
      [task.priorityControlNames, task.namedControlValues],
    ) as NamedControlChange[]
  } catch (err: any) {
    error = err.toString()
  }

  // Dispatch action to propagate operation task result
  store.dispatch(applyOperationTaskResultAction({
    operationId: task.operation.id,
    taskVersion: task.version,
    controlChanges,
    error,
  }))

  // If the operation stays busy after dispatching the task result, we need to
  // repeat the process as control values seem to have changed in the meantime
  const postState: RootState = store.getState()
  if (hasNode(postState.blueprint.present, operationId)) {
    const postOperation = getOperationNode(postState.blueprint.present, operationId)
    if (postOperation.state === OperationState.Busy) {
      // Controls changed in the meantime, repeat the computation
      runOperationTask(store, operationId)
    }
  }
}
