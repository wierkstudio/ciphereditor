
import { ControllerMessage, WorkerMessage, WorkerRequest } from './shared'

// This constant is being injected during the build process
const iframeSrc: string =
  /* inject:iframe_html_url_literal */ 'data:text/html;' /* endinject */

const defaultContentSecurityPolicy = 'default-src \'none\'; script-src data:;'

/**
 * State of the processor worker
 */
enum ProcessorWorkerState {
  // Iframe and worker have not been initialized (least memory consumption)
  Initial = 'initial',
  // Await the iframe and worker to be loaded
  Loading = 'loading',
  // Await the initialize handler to complete (if any)
  Initializing = 'initializing',
  // The worker is ready to receive messages
  Running = 'running'
}

interface PromiseCallbacks {
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

interface QueuedWorkerMessage extends PromiseCallbacks {
  message: WorkerMessage | undefined
}

interface PendingWorkerRequest extends PromiseCallbacks {
  timeout: ReturnType<typeof setTimeout> | undefined
}

type InitializeHandler = ((processorWorker: ProcessorWorker) => void | Promise<void>) | undefined
type ResetHandler = ((processorWorker: ProcessorWorker, reason: unknown) => void | Promise<void>) | undefined

const defaultIframeTimeout = 5000
const defaultRequestTimeout = 5000

/**
 * Class managing a single sandboxed worker
 */
export class ProcessorWorker {
  // Internal state
  private state = ProcessorWorkerState.Initial
  private readonly contentSecurityPolicy: string
  private readonly functionPointerMap = new Map<string, Function>()
  private readonly pendingRequestMap = new Map<number, PendingWorkerRequest>()
  private queuedMessages: QueuedWorkerMessage[] = []
  private uniqueIdCounter: number = 1
  private iframeElement: HTMLIFrameElement | undefined
  private iframeTimeout: ReturnType<typeof setTimeout> | undefined

  // Handlers
  private readonly messageHandler = this.onWorkerMessage.bind(this)
  private initializeHandler: InitializeHandler
  private resetHandler: ResetHandler

  /**
   * Constructor
   * @param contentSecurityPolicy Content Security Policy (CSP) to be applied on
   * the sandbox iframe document.
   * See https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
   */
  constructor (contentSecurityPolicy: string = defaultContentSecurityPolicy) {
    this.contentSecurityPolicy = contentSecurityPolicy
  }

  /**
   * Load the iframe and prepare the worker inside it
   */
  private doLoadTransition (): void {
    if (this.state !== ProcessorWorkerState.Initial) {
      throw new Error(`No load transition available from state '${this.state}'`)
    }

    // Update state
    this.state = ProcessorWorkerState.Loading

    // Create sandbox iframe element
    const iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.setAttribute('csp', this.contentSecurityPolicy)
    iframe.referrerPolicy = 'no-referrer'

    // Make iframe invisible and non-interactable
    iframe.style.display = 'none'
    iframe.width = '0'
    iframe.height = '0'
    iframe.tabIndex = -1

    // Start listening to messages
    window.addEventListener('message', this.messageHandler)

    // Install an initialization timeout
    this.iframeTimeout = setTimeout(() => {
      this.doResetTransition(new Error(
        `Processor initialization took longer than ${defaultIframeTimeout}ms`
      ))
    }, defaultIframeTimeout)

    // Inject CSP into the iframe src data URI
    const preparedIframeSrc = iframeSrc.replace(
      '__INJECT_CSP__',
      JSON.stringify(this.contentSecurityPolicy).slice(1, -1)
    )

    // Install iframe and trigger loading
    this.iframeElement = iframe
    iframe.src = preparedIframeSrc
    document.body.appendChild(iframe)
  }

  /**
   * Trigger and await the initialize handler
   */
  private doInitializeTransition (): void {
    if (this.state !== ProcessorWorkerState.Loading) {
      throw new Error(`No initialize transition available from state '${this.state}'`)
    }

    // Update state
    this.state = ProcessorWorkerState.Initializing

    // Await initialization handler before transitioning to the run state
    const undefinedOrPromise = this.initializeHandler?.(this)
    if (undefinedOrPromise === undefined) {
      this.doRunTransition()
    } else {
      undefinedOrPromise
        .then(this.doRunTransition.bind(this))
        .catch(this.doResetTransition.bind(this))
    }
  }

  /**
   * Transition to the run state and execute queued messages
   */
  private doRunTransition (): void {
    if (this.state !== ProcessorWorkerState.Initializing) {
      throw new Error(`No run transition available from state '${this.state}'`)
    }

    // Update state
    this.state = ProcessorWorkerState.Running
    clearTimeout(this.iframeTimeout)

    // Send queued messages
    const queuedMessages = this.queuedMessages
    this.queuedMessages = []
    for (const queuedMessage of queuedMessages) {
      this.queueWorkerMessage(ProcessorWorkerState.Running, queuedMessage.message)
        .then(queuedMessage.resolve)
        .catch(queuedMessage.reject)
    }
  }

  /**
   * Transition to the initial state resetting state and rejecting queued messages
   */
  private doResetTransition (reason?: unknown): void {
    if (this.state === ProcessorWorkerState.Initial) {
      throw new Error(`No reset transition available from state '${this.state}'`)
    }

    // Reset state
    this.state = ProcessorWorkerState.Initial
    const queuedMessages = this.queuedMessages
    this.queuedMessages = []
    this.functionPointerMap.clear()
    clearTimeout(this.iframeTimeout)

    // Send terminate message
    this.postWorkerMessage({ type: 'terminate' })

    // Release iframe
    this.iframeElement?.parentNode?.removeChild(this.iframeElement)
    this.iframeElement = undefined

    // Remove message listener
    window.removeEventListener('message', this.messageHandler)

    // Reject pending messages after all reset side effects are done
    for (const queuedMessage of queuedMessages) {
      queuedMessage.reject(reason)
    }

    // Run reset handler
    void this.resetHandler?.(this, reason)
  }

  private onWorkerMessage (event: MessageEvent): void {
    // Ignore messages not originating from the managed iframe
    if (event.source !== this.iframeElement?.contentWindow) {
      return
    }

    // TODO: Validate privileged message
    const message: ControllerMessage = event.data
    switch (message.type) {
      case 'initialized': {
        this.doInitializeTransition()
        break
      }

      case 'respond': {
        const id = message.id
        if (typeof id !== 'number') {
          this.doResetTransition()
          break
        }

        const response = message.response
        const error = message.error
        const pendingRequest = this.pendingRequestMap.get(id)
        if (pendingRequest !== undefined) {
          // Remove pending request and resolve or reject it
          this.pendingRequestMap.delete(id)
          clearTimeout(pendingRequest.timeout)
          if (error === undefined) {
            pendingRequest.resolve(this.hydrateValue(response))
          } else {
            pendingRequest.reject(this.hydrateValue(error))
          }
        } else {
          this.doResetTransition()
        }
        break
      }

      case 'error': {
        this.doResetTransition()
        break
      }
    }
  }

  private exportValue (value: any): any {
    // TODO: This function should be reused in the worker
    switch (Object.prototype.toString.call(value)) {
      case '[object Array]': {
        // Export each element recursively
        return value.map(this.exportValue.bind(this))
      }
      case '[object Object]': {
        // Export each key value pair recursively
        const exportedValue: any = {}
        for (const key of Object.keys(value)) {
          exportedValue[key] = this.exportValue(value[key])
        }
        return exportedValue
      }
      case '[object Function]':
      case '[object AsyncFunction]': {
        // Wrap function in a function pointer proxy object
        const func = value as Function
        const pointer = `func${this.getNextUniqueId()}/${func.length}`
        this.functionPointerMap.set(pointer, func)
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

  private hydrateValue (value: any): any {
    // TODO: This function should be reused in the worker
    switch (Object.prototype.toString.call(value)) {
      case '[object Array]': {
        // Hydrate each element recursively
        return value.map(this.hydrateValue.bind(this))
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
          return this.callFunctionPointer.bind(this, pointer)
        } else {
          // Hydrate each key value pair recursively
          const hydratedValue: any = {}
          for (const key of Object.keys(value)) {
            hydratedValue[key] = this.hydrateValue(value[key])
          }
          return hydratedValue
        }
      }
      default: {
        return value
      }
    }
  }

  /**
   * Return a unique number
   */
  private getNextUniqueId (): number {
    this.uniqueIdCounter = (this.uniqueIdCounter + 1) % Number.MAX_SAFE_INTEGER
    return this.uniqueIdCounter
  }

  /**
   * Send a message to the current worker iframe in sync.
   */
  private postWorkerMessage (message: WorkerMessage): void {
    const workerContentWindow = this.iframeElement?.contentWindow ?? undefined
    if (workerContentWindow === undefined) {
      throw new Error('Worker content window is not available to receive messages')
    }
    workerContentWindow.postMessage(message, '*')
  }

  /**
   * Send a message object to the worker and await its delivery.
   * @param targetState Worker state for which the given message is queued for
   * @param message Message to be posted; Use `undefined` to not post a message
   * and instead resolve the resulting promise as soon as this queue entry is
   * being worked on.
   */
  private async queueWorkerMessage (
    targetState: 'initializing' | 'running' | 'both',
    message: WorkerMessage | undefined
  ): Promise<void> {
    if (
      (targetState === 'initializing' && this.state === ProcessorWorkerState.Initializing) ||
      (targetState !== 'initializing' && this.state === ProcessorWorkerState.Running)
    ) {
      // To await a target state, the message may be undefined
      if (message !== undefined) {
        this.postWorkerMessage(message)
      }
    } else if (targetState === 'initializing') {
      throw new Error('Initializing messages must be sent within the initializing handler')
    } else {
      // Queue the message for the running state
      const deliveryPromise = new Promise<void>((resolve, reject) => {
        this.queuedMessages.push({ message, resolve, reject })
      })

      // Trigger initialization, if not done yet
      if (this.state === ProcessorWorkerState.Initial) {
        this.doLoadTransition()
      }

      return await deliveryPromise
    }
  }

  /**
   * Send a request object to the worker and await its response.
   */
  private async queueWorkerRequest (
    targetState: 'initializing' | 'running' | 'both',
    request: WorkerRequest,
    timeout = defaultRequestTimeout
  ): Promise<any> {
    const id = this.getNextUniqueId()
    const message: WorkerMessage = { type: 'request', id, request }
    return await new Promise<any>((resolve, reject) => {
      const pendingRequest: PendingWorkerRequest =
        { resolve, reject, timeout: undefined }
      this.pendingRequestMap.set(id, pendingRequest)
      void this.queueWorkerMessage(targetState, message)
        .then(() => {
          // Install a request timeout after the message has been delivered
          pendingRequest.timeout = setTimeout(() => {
            if (this.pendingRequestMap.has(id)) {
              // The request timed out, reject it
              this.pendingRequestMap.delete(id)
              reject(new Error(`Request took longer than ${timeout}ms`))
            }
          }, timeout)
        })
        .catch((reason) => {
          // The message delivery failed and our request should fail with it
          this.pendingRequestMap.delete(id)
          clearTimeout(pendingRequest.timeout)
          reject(reason)
        })
    })
  }

  /**
   * Replace the initialize handler; Only methods prefixed with `initializeWith`
   * should be called within the handler.
   */
  public setInitializeHandler (handler: InitializeHandler): void {
    this.initializeHandler = handler
  }

  /**
   * Replace the reset handler
   */
  public setResetHandler (handler: ResetHandler): void {
    this.resetHandler = handler
  }

  /**
   * Return a promise that resolves when the worker has been activated.
   */
  public async activate (): Promise<void> {
    await this.queueWorkerMessage('running', undefined)
  }

  /**
   * Import the given script urls into the worker
   */
  public async importScripts (urls: string[]): Promise<void> {
    await this.queueWorkerRequest('running', {
      type: 'importScripts',
      urls
    })
  }

  /**
   * Import the given script urls into the worker during initialization
   */
  public async initializeWithImportScripts (urls: string[]): Promise<void> {
    await this.queueWorkerRequest('initializing', {
      type: 'importScripts',
      urls
    })
  }

  /**
   * Import the given JavaScript source into the worker
   */
  public async importSource (
    source: string
  ): Promise<void> {
    const scriptUrl = URL.createObjectURL(new Blob([source]))
    return await this.importScripts([scriptUrl])
  }

  /**
   * Import the given JavaScript source into the worker during initialization
   */
  public async initializeWithImportSource (source: string): Promise<void> {
    const scriptUrl = URL.createObjectURL(new Blob([source]))
    return await this.initializeWithImportScripts([scriptUrl])
  }

  /**
   * Retrieve the value of the given module export
   */
  public async getModuleExport (
    moduleId: string | undefined,
    exportName: string
  ): Promise<unknown> {
    return await this.queueWorkerRequest('running', {
      type: 'getModuleExport',
      moduleId: moduleId ?? 'default',
      exportName
    })
  }

  /**
   * Retrieve the value of the given module export during initialization
   */
  public async initializeWithGetModuleExport (
    moduleId: string | undefined,
    exportName: string
  ): Promise<unknown> {
    return await this.queueWorkerRequest('initializing', {
      type: 'getModuleExport',
      moduleId: moduleId ?? 'default',
      exportName
    })
  }

  /**
   * Call a module export and retrieve its return value
   */
  public async callModuleExport (
    moduleId: string | undefined,
    exportName: string,
    ...args: unknown[]
  ): Promise<any> {
    return await this.queueWorkerRequest('running', {
      type: 'callModuleExport',
      moduleId: moduleId ?? 'default',
      exportName,
      args: args.map(this.exportValue.bind(this))
    })
  }

  /**
   * Call a module export and retrieve its return value during initialization
   */
  public async initializeWithCallModuleExport (
    moduleId: string | undefined,
    exportName: string,
    ...args: unknown[]
  ): Promise<any> {
    return await this.queueWorkerRequest('initializing', {
      type: 'callModuleExport',
      moduleId: moduleId ?? 'default',
      exportName,
      args: args.map(this.exportValue.bind(this))
    })
  }

  /**
   * Call a proxied function pointer and retrieve its return value
   */
  private async callFunctionPointer (
    pointer: string,
    ...args: unknown[]
  ): Promise<any> {
    // Function pointers are available as soon as they are provided in a worker
    // response; we do not need to queue this request for a specific state
    return await this.queueWorkerRequest('both', {
      type: 'callFunctionPointer',
      pointer,
      args: args.map(this.exportValue.bind(this))
    })
  }
}
