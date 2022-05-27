
export type ViewModifiers = string[] | string

/**
 * Render a BEM class name given the block name and modifiers.
 */
export const renderClassName = (
  blockName: string,
  modifiers: ViewModifiers = []
): string =>
  [blockName].concat(
    (typeof modifiers === 'string' ? modifiers.split(/\s+/) : modifiers)
      .filter(value => value !== '')
      .map(modifier => blockName + '--' + modifier)
  ).join(' ')

/**
 * Merge the given BEM modifiers.
 */
export const mergeModifiers = (a: ViewModifiers = [], b: ViewModifiers = []): ViewModifiers => {
  const normalizedA = typeof a === 'string' ? a.split(/\s+/) : a
  const normalizedB = typeof b === 'string' ? b.split(/\s+/) : b
  return normalizedA.concat(normalizedB)
}

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
export const releaseOptionalPointerCapture = (event: any): void => {
  const target = (event?.nativeEvent ?? event)?.target
  if (typeof target?.hasPointerCapture === 'function') {
    if (target.hasPointerCapture(event.pointerId) === true) {
      target.releasePointerCapture(event.pointerId)
    }
  }
}
