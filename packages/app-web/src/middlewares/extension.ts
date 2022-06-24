
import { AnyAction, Middleware } from 'redux'
import { BlueprintNodeId, BlueprintState } from '../slices/blueprint/types/blueprint'
import { ContributionExports, ExtensionContext, OperationIssue, OperationResult } from '@ciphereditor/types'
import { ProcessorWorker } from '@ciphereditor/processor'
import { RootState } from '../slices'
import { applyOperationResultAction } from '../slices/blueprint'
import { contributionExportsSchema } from '../slices/blueprint/types/extension'
import { getBusyOperationIds, getOpenOperationRequest, getOperationNode } from '../slices/blueprint/selectors/operation'
import { getNodeNamedControls } from '../slices/blueprint/selectors/control'
import { hasNode } from '../slices/blueprint/selectors/blueprint'
import { operationResultSchema, OperationState } from '../slices/blueprint/types/operation'
import { z } from 'zod'

export const extensionMiddleware: Middleware<{}, RootState> = store => next => (action: AnyAction) => {
  const preBusyOperationIds = getBusyOperationIds(store.getState().blueprint.present)
  const result = next(action)
  const postBusyOperationIds = getBusyOperationIds(store.getState().blueprint.present)

  // Trigger operation tasks for operations that were marked busy
  postBusyOperationIds
    .filter(id => !preBusyOperationIds.includes(id))
    .forEach(id => {
      void executeOperation(store, id)
    })

  return result
}

/**
 * Run the current task of the given operation asynchronously in the processor
 * and dispatch an action once a result is available.
 */
const executeOperation = async (store: any, operationId: BlueprintNodeId): Promise<void> => {
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
    const contributionName = operation.contributionName
    const contributionExports = await getContributionExports(operation.contributionName, operation.extensionUrl)
    const contributionType = contributionExports.contribution.type
    if (contributionExports.contribution.type !== 'operation') {
      throw new Error(`Contribution '${contributionName}' was expected to be of type operation but found '${contributionType}'`)
    }

    const rawResult: unknown = await contributionExports.body.execute(request)

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
      void executeOperation(store, operationId)
    }
  }
}

const contributionWorkerMap = new Map<string, ProcessorWorker>()
const contributionExportsMap = new Map<string, ContributionExports>()

const extensionContext: ExtensionContext = {}

const getContributionExports = async (
  name: string,
  fallbackExtensionUrl?: string
): Promise<ContributionExports> => {
  // Return contribution exports, if the parent worker is active right now
  let contributionExports = contributionExportsMap.get(name)
  if (contributionExports !== undefined) {
    return contributionExports
  }

  // Wake up the contribution worker and look up the contribution exports, again
  const contributionWorker = contributionWorkerMap.get(name)
  if (contributionWorker !== undefined) {
    await contributionWorker.activate()
    contributionExports = contributionExportsMap.get(name)
    if (contributionExports !== undefined) {
      return contributionExports
    }
  }

  if (fallbackExtensionUrl === undefined) {
    throw new Error(`Contribution '${name} could not be found`)
  }

  // Load the given fallback extension
  await activateExtension(fallbackExtensionUrl)
  contributionExports = contributionExportsMap.get(name)
  if (contributionExports !== undefined) {
    return contributionExports
  } else {
    throw new Error(`Contribution '${name}' is not provided by extension '${fallbackExtensionUrl}'`)
  }
}

const activateExtension = async (extensionUrl: string): Promise<void> => {
  const worker = new ProcessorWorker()
  let activeContributionNames: string[] = []

  worker.setInitializeHandler(async (worker) => {
    // Import extension bundle
    await worker.initializeWithImportScripts([extensionUrl])

    // Call activate extension module export and await its result
    const untrustedContributions = await worker.initializeWithCallModuleExport(
      'index', 'activate', extensionContext)

    // Validate the untrusted result (originating from third-party code)
    const contributionsExports =
      z.array(contributionExportsSchema).parse(untrustedContributions)

    // Register each contribution
    for (const contributionExports of contributionsExports) {
      const name = contributionExports.contribution.name
      activeContributionNames.push(name)
      contributionWorkerMap.set(name, worker)
      contributionExportsMap.set(name, contributionExports)
    }
  })

  worker.setResetHandler(async (worker) => {
    const contributionNames = activeContributionNames
    activeContributionNames = []
    for (const contributionName of contributionNames) {
      const workerInCharge = contributionWorkerMap.get(contributionName)
      if (worker !== workerInCharge) {
        contributionExportsMap.delete(contributionName)
      }
    }
  })

  return await worker.activate()
}
