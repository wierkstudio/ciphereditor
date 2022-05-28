
export const postInitiatedMessage = (): void => {
  window.parent.postMessage({
    type: 'initiated'
  }, '*')
}

export const postAccessibilityChangedMessage = (message: {
  theme: string
  reducedMotionPreference: string
}): void => {
  window.parent.postMessage({
    type: 'accessibilitySettingsChange',
    ...message
  }, '*')
}

export const postIntrinsicHeightChangeMessage = (message: {
  height: number
}): void => {
  window.parent.postMessage({
    type: 'intrinsicHeightChange',
    ...message
  }, '*')
}

export const postMaximizedChangedMessage = (message: {
  maximized: boolean
}): void => {
  window.parent.postMessage({
    type: 'maximizedChange',
    ...message
  }, '*')
}
