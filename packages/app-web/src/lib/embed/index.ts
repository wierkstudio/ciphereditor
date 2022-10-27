
import { WebsiteMessage } from '@ciphereditor/library'

/**
 * Post the given message to the website window
 */
export const postWebsiteMessage = (message: WebsiteMessage): void => {
  window.parent.postMessage(message, '*')
}

/**
 * Track goal with the given name and value
 */
export const trackEvent = (name: string, value?: number): void =>
  postWebsiteMessage({ type: 'track', name, value })
