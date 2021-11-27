
const processorFramePingInterval = 10 * 1000

const enum ProcessorFrameState {
  Uninitialized,
  Initializing,
  Initialized,
}

const enum ProcessorMessageType {
  Configure = 'configure',
  Ping = 'ping',
  GetModuleValue = 'get_module_value',
  CallModuleFunction = 'call_module_function',
  Touch = 'touch',
  Terminate = 'terminate',
}

type ProcessorMessage = {
  type: ProcessorMessageType
  [name: string]: unknown
}

type QueuedProcessorMessage = {
  message: ProcessorMessage
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
}

/**
 * Class managing the processor iframe and interfacing to it.
 */
export default class Processor {
  /**
   * Processor frame url
   */
  readonly frameUrl: string

  /**
   * Processor frame state
   */
  private frameState = ProcessorFrameState.Uninitialized

  /**
   * Processor frame ping timer
   */
  private framePingTimer?: NodeJS.Timeout

  /**
   * Flag tracking that the pong message has been received within an interval
   */
  private framePongReceived = true

  /**
   * Processor frame element
   */
  private frame?: HTMLIFrameElement

  /**
   * Processor frame configuration
   */
  private frameConfig = {
    basePath: '',
    messageTimeout: 10 * 1000,
    idleTimeout: 15 * 60 * 1000,
  }

  /**
   * Unique id counter
   */
  private counter: number = 0

  /**
   * Queue of pending messages
   */
  private queuedMessages = new Map<number, QueuedProcessorMessage>()

  /**
   * Default message timeout
   */
  private messageTimeout: number = 30 * 1000

  private readonly frameMessageHandler = this.handleFrameMessage.bind(this)
  private readonly framePingHandler = this.handleFramePing.bind(this)
  private readonly framePongHandler = this.handleFramePong.bind(this)

  /**
   * Constructor
   * @param frameUrl Processor frame url
   * @param frameConfig Processor frame config
   */
  constructor (frameUrl: string, frameConfig: object = {}) {
    this.frameUrl = frameUrl
    this.frameConfig = { ...this.frameConfig, ...frameConfig }
  }

  /**
   * Get a value exported by a bundle module.
   * @param bundleSrc Bundle source file url
   * @param moduleId AMD module id
   * @param exportName Export name
   * @param timeout Timeout after which processing is canceled
   * @returns Promise resolving to the exported value
   */
  getModuleValue (
    bundleSrc: string,
    moduleId: string,
    exportName: string,
    timeout?: number
  ): Promise<unknown> {
    return this.postMessage({
      type: ProcessorMessageType.GetModuleValue,
      worker: bundleSrc,
      moduleId,
      exportName,
      timeout: timeout || this.messageTimeout,
    })
  }

  /**
   * Call a function exported by a bundle module.
   * @param bundleSrc Bundle source file url
   * @param moduleId AMD module id
   * @param exportName Export name
   * @param args Arguments the function should be called with
   * @param timeout Timeout after which processing is canceled
   * @returns Promise resolving to the return value
   */
  callModuleFunction (
    bundleSrc: string,
    moduleId: string,
    exportName: string,
    args: unknown[],
    timeout?: number
  ): Promise<unknown> {
    return this.postMessage({
      type: ProcessorMessageType.CallModuleFunction,
      worker: bundleSrc,
      moduleId,
      exportName,
      args,
      timeout: timeout || this.messageTimeout,
    })
  }

  /**
   * Preload a bundle before getting or calling one of its exports.
   * @param bundleSrc Bundle source file url
   * @param timeout Timeout after which processing is canceled
   * @returns Promise resolving when the bundle is loaded
   */
  preloadBundle (bundleSrc: string, timeout?: number): Promise<void> {
    return this.postMessage({
      type: ProcessorMessageType.Touch,
      worker: bundleSrc,
      timeout: timeout || this.messageTimeout,
    })
  }

  /**
   * Terminate and remove a bundle.
   * @param bundleSrc Bundle source file url
   * @returns Promise resolving when the bundle is removed
   */
  terminateBundle (bundleSrc: string): Promise<void> {
    return this.postMessage({
      type: ProcessorMessageType.Terminate,
      worker: bundleSrc,
    })
  }

  /**
   * Post a message to the processor frame.
   * @param message Message to be posted (without the id attribute)
   * @param force Wether to send the message without waiting for the frame to
   * be initialized (e.g. to send the initial `configure` message).
   * @returns Promise resolving to the response message value
   */
  private postMessage (message: ProcessorMessage, force = false): Promise<any> {
    return new Promise((resolve, reject) => {
      // Attach a unique message id and add it to the queue
      const messageId = this.getNextRequestId()
      const messageWithId = { ...message, id: messageId }
      this.queuedMessages.set(messageId, {
        message: messageWithId,
        resolve,
        reject
      })

      // Trigger lazy frame initialization or post message, if already done
      if (this.frameState === ProcessorFrameState.Initialized || force) {
        const queuedMessage = this.queuedMessages.get(messageId)!
        this.frame!.contentWindow!.postMessage(queuedMessage.message, '*')
      } else if (this.frameState === ProcessorFrameState.Uninitialized) {
        this.initializeFrame()
      }
    })
  }

  /**
   * Initialize the processor iframe.
   */
  private initializeFrame (): void {
    if (this.frameState === ProcessorFrameState.Uninitialized) {
      this.frameState = ProcessorFrameState.Initializing

      // Subscribe to messages
      window.addEventListener('message', this.frameMessageHandler)

      // Create frame element
      this.frame = document.createElement('iframe')
      this.frame.onload = this.handleFrameLoad.bind(this)
      this.frame.setAttribute('sandbox', 'allow-scripts')
      this.frame.src = this.frameUrl

      // Make frame unavailable to the user
      this.frame.style.display = 'none'
      this.frame.width = '0'
      this.frame.height = '0'
      this.frame.tabIndex = -1

      // Activate frame
      document.body.appendChild(this.frame)

      // Start ping timer
      this.framePongReceived = false
      this.framePingTimer = setInterval(
        this.framePingHandler, processorFramePingInterval)
    }
  }

  /**
   * Handle the managed frame load event.
   * @param evt Load event
   */
  private async handleFrameLoad (evt: Event): Promise<void> {
    // Configure processor frame
    try {
      await this.postMessage({
        type: ProcessorMessageType.Configure,
        config: this.frameConfig,
      }, true)
    } catch (err: any) {
      this.destroyFrame(err)
    }

    // Mark frame as initialized
    this.frameState = ProcessorFrameState.Initialized

    // Post queued messages
    for (let [, queuedMessage] of this.queuedMessages) {
      this.frame!.contentWindow!.postMessage(queuedMessage.message, '*')
    }
  }

  /**
   * Handle a message originating from the managed frame element.
   * @param evt Message event
   */
   private handleFrameMessage (evt: MessageEvent): void {
    // Ignore messages not originating from the frame we manage
    if (!this.frame || evt.source !== this.frame.contentWindow) {
      return
    }

    const message = evt.data
    const messageId = evt.data.id

    const queuedMessage = this.queuedMessages.get(messageId)
    if (queuedMessage === undefined) {
      throw new Error('Received unexpected message from processor frame')
    }

    // Remove message from queue
    this.queuedMessages.delete(messageId)

    const messageError = message.error
    if (!messageError) {
      queuedMessage.resolve(message.value)
    } else {
      queuedMessage.reject(messageError)
    }
  }

  /**
   * Handle the frame ping timer ticks.
   */
  private handleFramePing (): void {
    if (this.frameState === ProcessorFrameState.Initializing) {
      this.destroyFrame(new Error('Processor frame could not be loaded'))
    } else if (this.queuedMessages.size > 0) {
      if (this.framePongReceived) {
        this.framePongReceived = false
        this.postMessage({ type: ProcessorMessageType.Ping })
          .then(this.framePongHandler)
      } else {
        this.destroyFrame(new Error('Processor frame has become unresponsive'))
      }
    }
  }

  /**
   * Handle the frame ping response message.
   */
  private handleFramePong (): void {
    this.framePongReceived = true
  }

  /**
   * Destroy and remove the processor iframe and reject pending messages.
   * @param rejectReason Reason any pending messages should be rejected with
   */
  private destroyFrame (rejectReason: any): void {
    if (this.frameState !== ProcessorFrameState.Uninitialized) {
      this.frameState = ProcessorFrameState.Uninitialized

      // Unsubscribe from frame messages
      window.removeEventListener('message', this.frameMessageHandler)

      // Clear ping timer
      clearInterval(this.framePingTimer!)
      this.framePingTimer = undefined

      // Let go frame element
      document.body.removeChild(this.frame!)
      this.frame = undefined

      // Reject pending messages
      const pendingRequestHandlings = Array.from(this.queuedMessages.values())
      this.queuedMessages.clear()
      for (let handling of pendingRequestHandlings) {
        handling.reject(rejectReason)
      }
    }
  }

  /**
   * Return a unique number
   */
  private getNextRequestId (): number {
    this.counter = (this.counter + 1) % Number.MAX_SAFE_INTEGER
    return this.counter
  }
}
