
import { useEffect } from 'react'

/**
 * Register a keydown event handler to the given element and hand over the
 * pressed key combinations using a shortcut notation.
 */
const useShortcutHandler = (
  element: Window | HTMLElement | null,
  onShortcut: (shortcut: string, event: KeyboardEvent) => void
): void => {
  useEffect(() => {
    if (element === null) {
      return
    }
    const keyDownListener = (event: KeyboardEvent): void => {
      const pressedKeys = ['Alt', 'Control', 'Shift', 'Meta']
        .filter(modifier => event.getModifierState(modifier))
      if (!pressedKeys.includes(event.key)) {
        pressedKeys.push(event.key)
      }
      const shortcut = pressedKeys.join('+').toLowerCase()
      onShortcut(shortcut, event)
    }
    element.addEventListener('keydown', keyDownListener as any)
    return () => element.removeEventListener('keydown', keyDownListener as any)
  }, [element, onShortcut])
}

export default useShortcutHandler
