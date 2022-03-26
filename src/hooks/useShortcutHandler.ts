
import { useEffect } from 'react'

/**
 * Register a keydown event handler to the given element and hand over the
 * pressed key combinations using a shortcut notation.
 */
export default function useShortcutHandler(
  element: Window | HTMLElement | null,
  onShortcut: (shortcut: string, event: KeyboardEvent) => void,
) {
  useEffect(() => {
    if (element === null) {
      return
    }
    const keyDownListener = (event: KeyboardEvent) => {
      const pressedKeys = ['Alt', 'Control', 'Shift', 'Meta']
        .filter(modifier => event.getModifierState(modifier))
      if (pressedKeys.indexOf(event.key) === -1) {
        pressedKeys.push(event.key)
      }
      const shortcut = pressedKeys.join('+').toLowerCase()
      onShortcut(shortcut, event)
    }
    element.addEventListener('keydown', keyDownListener as any)
    return () => element.removeEventListener('keydown', keyDownListener as any)
  }, [element, onShortcut])
}
