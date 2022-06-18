
/**
 * Request objects targeted at the unprivileged worker.
 */
export type WorkerRequest =
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
*/
export type WorkerMessage =
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
*/
export interface ControllerRequest {
  type: 'callFunctionPointer'
  pointer: string
  args: unknown[]
}

/**
* Message objects targeted at the privileged parent.
*/
export type ControllerMessage =
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
