
import { useEffect } from 'react'

/**
 * Listens to keyboard events, compiles the shortcut notation and calls the
 * provided onShortcut
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
