
import { keyCombinationFromEvent } from '../lib/utils/keyboard'
import { useEffect } from 'react'

/**
 * Listen to keyboard events, compile a key combination notation string and call
 * the provided `keyBindingHandler`
 */
const useKeyBindingHandler = (
  element: Window | HTMLElement | null,
  keyBindingHandler: (keyCombination: string, event: KeyboardEvent) => void
): void => {
  useEffect(() => {
    if (element === null) {
      return
    }
    const keyDownListener = (event: KeyboardEvent): void => {
      const keyCombination = keyCombinationFromEvent(event)
      keyBindingHandler(keyCombination, event)
    }
    element.addEventListener('keydown', keyDownListener as any)
    return () => element.removeEventListener('keydown', keyDownListener as any)
  }, [element, keyBindingHandler])
}

export default useKeyBindingHandler
