
/**
 * Constant that may be used to make event listeners passive
 */
export const passiveListenerOptions: AddEventListenerOptions & EventListenerOptions =
  { passive: true }

/**
 * Safely release a possible pointer capture for the given UIEvent.
 *
 * We sometimes get 'implicit pointer capture' on touchscreen browsers that
 * allow direct manipulation. When listening to subsequent pointer events on
 * `window` we need to get rid of the capture.
 *
 * @param event UIEvent or the React version of it
 */
export const releaseOptionalPointerCapture = (event: any) => {
  const target = (event?.nativeEvent ?? event)?.target
  if (target?.hasPointerCapture !== undefined) {
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId)
    }
  }
}
