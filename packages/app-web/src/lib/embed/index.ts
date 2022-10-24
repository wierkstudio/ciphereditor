
import { WebsiteMessage } from '@ciphereditor/library'

/**
 * Post the given message to the website window
 */
export const postWebsiteMessage = (message: WebsiteMessage): void => {
  window.parent.postMessage(message, '*')
}
