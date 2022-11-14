
import { WebsiteMessage } from '@ciphereditor/library'

/**
 * Variable tracking the last reported intrinsic height to deduplicate
 */
let lastIntrinsicHeight = -1

/**
 * Post the given message to the website window
 */
export const postWebsiteMessage = (message: WebsiteMessage): void =>
  window.parent.postMessage(message, '*')

/**
 * Post an 'intrinsicHeightChange' message to the website window
 */
export const postIntrinsicHeightChange = (height: number): void => {
  if (height !== lastIntrinsicHeight) {
    lastIntrinsicHeight = height
    postWebsiteMessage({ type: 'intrinsicHeightChange', height })
  }
}

/**
 * Track goal with the given name and value
 */
export const trackEvent = (name: string, value?: number): void =>
  postWebsiteMessage({ type: 'track', name, value })
