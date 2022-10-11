
import { useEffect } from 'react'

/**
 * Listen to keyboard events, compile a key combination notation string and call
 * the provided `keyBindingHandler`
 */
const useKeyBindingHandler = (
  element: Window | HTMLElement | null,
  keyBindingHandler: (shortcut: string, event: KeyboardEvent) => void
): void => {
  useEffect(() => {
    if (element === null) {
      return
    }
    const keyDownListener = (event: KeyboardEvent): void => {
      const pressedKeys = ['Control', 'Alt', 'Shift', 'Meta']
        .filter(modifier => event.getModifierState(modifier))
      if (!pressedKeys.includes(event.key)) {
        pressedKeys.push(event.key)
      }
      const shortcut = pressedKeys.join('+').toLowerCase()
      keyBindingHandler(shortcut, event)
    }
    element.addEventListener('keydown', keyDownListener as any)
    return () => element.removeEventListener('keydown', keyDownListener as any)
  }, [element, keyBindingHandler])
}

export default useKeyBindingHandler
