
import { keyCombinationFromEvent } from '../lib/utils/keyboard'
import { MutableRefObject, useEffect } from 'react'

/**
 * Listen to keyboard events, compile a key combination notation string and call
 * the provided `keyBindingHandler`
 * @param elementRef Reference to an element or undefined if window keyboard
 * events are targeted
 */
const useKeyBindingHandler = (
  elementRef: MutableRefObject<HTMLElement | null> | undefined,
  keyBindingHandler: (keyCombination: string, event: KeyboardEvent) => void
): void => {
  useEffect(() => {
    const element = elementRef !== undefined ? elementRef.current : window
    if (element === null) {
      return
    }
    const keyDownListener = (event: KeyboardEvent): void => {
      const keyCombination = keyCombinationFromEvent(event)
      keyBindingHandler(keyCombination, event)
    }
    element.addEventListener('keydown', keyDownListener as any)
    return () => element.removeEventListener('keydown', keyDownListener as any)
  }, [elementRef, keyBindingHandler])
}

export default useKeyBindingHandler
