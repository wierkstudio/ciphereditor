
/**
 * Request objects targeted at the unprivileged worker.
 * TODO: Reuse the type in `shared.ts`.
 */
type WorkerRequest =
  {
    type: 'importScripts'
    urls: string[]
  } |
  {
    type: 'getModuleExport'
    moduleId: string
    exportName: string
  } |
  {
    type: 'callModuleExport'
    moduleId: string
    exportName: string
    args: unknown[]
  } |
  {
    type: 'callFunctionPointer'
    pointer: string
    args: unknown[]
  }

/**
 * Message objects targeted at the unprivileged worker.
 * TODO: Reuse the type in `shared.ts`.
 */
type WorkerMessage =
  {
    type: 'request'
    id: number
    request: WorkerRequest
  } |
  {
    type: 'respond'
    id: number
    response: any | undefined
    error: any | undefined
  } |
  {
    type: 'terminate'
  }

/**
 * Request objects targeted at the privileged parent.
 * TODO: Reuse the type in `shared.ts`.
 */
interface ControllerRequest {
  type: 'callFunctionPointer'
  pointer: string
  args: unknown[]
}

/**
 * Message objects targeted at the privileged parent.
 * TODO: Reuse the type in `shared.ts`.
 */
type ControllerMessage =
  {
    type: 'initialized'
  } |
  {
    type: 'request'
    id: number
    request: ControllerRequest
  } |
  {
    type: 'respond'
    id: number
    response: any | undefined
    error: any | undefined
  } |
  {
    type: 'error'
    error: any
  }

interface PromiseCallbacks {
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

;(() => {
  let uniqueIdCounter = 0
  const functionPointerMap = new Map<string, Function>()
  const pendingRequestMap = new Map<number, PromiseCallbacks>()

  const getNextUniqueId = (): number => {
    uniqueIdCounter = (uniqueIdCounter + 1) % Number.MAX_SAFE_INTEGER
    return uniqueIdCounter
  }

  const exportValue = (value: any): any => {
    switch (Object.prototype.toString.call(value)) {
      case '[object Array]': {
        // Export each element recursively
        return value.map(exportValue)
      }
      case '[object Object]': {
        // Export each key value pair recursively
        const exportedValue: any = {}
        for (const key of Object.keys(value)) {
          exportedValue[key] = exportValue(value[key])
        }
        return exportedValue
      }
      case '[object Function]':
      case '[object AsyncFunction]': {
        // Wrap function in a function pointer proxy object
        const func = value as Function
        const pointer = `func${getNextUniqueId()}/${func.length}`
        functionPointerMap.set(pointer, func)
        return { __$proxy: 'function', pointer }
      }
      case '[object Error]': {
        // Wrap error instance in a proxy object
        return { __$proxy: 'error', name: value.name, message: value.message }
      }
      default: {
        return value
      }
    }
  }

  const hydrateValue = (value: any): any => {
    switch (Object.prototype.toString.call(value)) {
      case '[object Array]': {
        // Hydrate each element recursively
        return value.map(hydrateValue)
      }
      case '[object Object]': {
        if (value.__$proxy === 'error' && typeof value.name === 'string' && typeof value.message === 'string') {
          // Rebuild error instance from proxy object
          const error = new Error()
          error.message = value.message
          error.name = value.name
          return error
        } else if (value.__$proxy === 'function' && typeof value.pointer === 'string') {
          // Rebuild function from proxy object
          const pointer = value.pointer
          return callFunctionPointer.bind(null, pointer)
        } else {
          // Hydrate each key value pair recursively
          const hydratedValue: any = {}
          for (const key of Object.keys(value)) {
            hydratedValue[key] = hydrateValue(value[key])
          }
          return hydratedValue
        }
      }
      default: {
        return value
      }
    }
  }

  const callFunctionPointer = async (
    pointer: string,
    ...args: unknown[]
  ): Promise<any> => {
    return await postControllerRequest({
      type: 'callFunctionPointer',
      pointer,
      args: args.map(exportValue)
    })
  }

  const postControllerRequest = async (request: ControllerRequest): Promise<any> => {
    const id = getNextUniqueId()
    const message: ControllerMessage = { type: 'request', id, request }
    return await new Promise<any>((resolve, reject) => {
      pendingRequestMap.set(id, { resolve, reject })
      postControllerMessage(message)
    })
  }

  const postControllerMessage = (message: ControllerMessage): void => {
    postMessage(message)
  }

  const handleWorkerRequest = async (request: WorkerRequest): Promise<any> => {
    const requestType = request.type
    switch (requestType) {
      case 'importScripts': {
        const urls = request.urls
        // Throw when importScripts returns a non-undefined value
        // to stay backward compatible with older WebKit browsers
        const returnValue = importScripts(...urls) as undefined
        if (typeof returnValue !== 'undefined') {
          throw new Error('Import scripts failed')
        }
        return true
      }

      case 'getModuleExport':
      case 'callModuleExport': {
        const exportId = `${request.exportName}.${request.moduleId}`

        // Require module (using our own loader)
        const module = (self as any).require(request.moduleId)

        // Retrieve export
        const moduleExport = module[request.exportName] ?? undefined
        if (moduleExport === undefined) {
          throw new Error(`Module export '${exportId}' is not available`)
        }

        // Return value, if getter was called
        if (requestType === 'getModuleExport') {
          return moduleExport
        }

        // Fail, if trying to call something that is not a function
        if (typeof moduleExport !== 'function') {
          throw new Error(`Module export '${exportId}' is not callable`)
        }

        // Fail, if the function does not have the same number of arguments
        const arity = (moduleExport as Function).length
        if (arity !== request.args.length) {
          throw new Error(`Module export '${exportId}' expects ${arity} args but received ${request.args.length} args`)
        }

        // Call the module export and return result (might be a promise)
        return moduleExport.apply(null, request.args)
      }

      case 'callFunctionPointer': {
        const func = functionPointerMap.get(request.pointer)
        if (func === undefined) {
          throw new Error(`Unknown function pointer '${request.pointer}'`)
        }

        const arity = func.length
        if (arity !== request.args.length) {
          throw new Error(`Function pointer '${request.pointer}' expects ${arity} args but received ${request.args.length} args`)
        }

        // Call the function and return result (might be a promise)
        return func.apply(null, request.args)
      }

      default: {
        const exhaustiveCheck: never = requestType
        throw new Error(`Unhandled request type '${exhaustiveCheck as string}'`)
      }
    }
  }

  const handleWorkerMessage = (message: WorkerMessage): void => {
    const messageType = message.type
    switch (messageType) {
      case 'request': {
        const id = message.id
        const request = message.request
        handleWorkerRequest(request)
          .then((rawResponse: any) => {
            postControllerMessage({
              type: 'respond',
              id,
              response: exportValue(rawResponse),
              error: undefined
            })
          })
          .catch((error: any) => {
            postControllerMessage({
              type: 'respond',
              id,
              response: undefined,
              error: exportValue(error.message)
            })
          })
        break
      }

      case 'respond': {
        const id = message.id
        const response = message.response
        const error = message.error
        const request = pendingRequestMap.get(id)
        if (request !== undefined) {
          pendingRequestMap.delete(id)
          if (error === undefined) {
            request.resolve(hydrateValue(response))
          } else {
            request.reject(hydrateValue(error))
          }
        }
        break
      }

      case 'terminate': {
        // This message is intercepted and executed by the iframe. Thus this
        // case should never match (we include it here to make TypeScript report
        // on wether the switch block is exhaustive)
        break
      }

      default: {
        const exhaustiveCheck: never = messageType
        throw new Error(`Unhandled message type '${exhaustiveCheck as string}'`)
      }
    }
  }

  // Listen to parent messages
  addEventListener('message', (event: MessageEvent) => {
    handleWorkerMessage(event.data as WorkerMessage)
  })

  // Send 'initialized' message to the parent
  postControllerMessage({ type: 'initialized' })
})()
