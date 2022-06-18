
// This constant is being injected during the build process
const workerSrc =
  /* inject:worker_script_url_literal */ 'data:text/javascript;' /* endinject */

;(() => {
  // Initialize worker
  const worker = new Worker(workerSrc)

  // Forward worker message to parent
  worker.addEventListener('message', (event: MessageEvent) => {
    if (typeof event.data.type === 'string' && event.data.type === 'terminate') {
      // Intercept terminate message
      worker.terminate()
    } else {
      // Forward everything else
      window.parent.postMessage(event.data, '*')
    }
  })

  // Send error message to parent
  worker.addEventListener('error', (event: ErrorEvent) => {
    window.parent.postMessage({ type: 'error', message: event.message }, '*')
  })

  // Forward parent message to worker
  window.addEventListener('message', (event: MessageEvent) => {
    worker.postMessage(event.data)
  })
})()
