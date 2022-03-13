
import { useCallback, useEffect } from 'react'
import useAppDispatch from './useAppDispatch'

/**
 * Hook registering the given shortcut bindings
 */
 export default function useAppShortcuts(bindings: { [type: string]: string }) {
  const dispatch = useAppDispatch()
  const keyDownListener = useCallback(event => {
    const pressedKeys = ['Meta', 'Control', 'Shift', 'Alt']
      .filter(modifier => event.getModifierState(modifier))
    if (pressedKeys.indexOf(event.key) === -1) {
      pressedKeys.unshift(event.key)
    }
    const keyCombination = pressedKeys.join('+').toLowerCase()
    const action = bindings[keyCombination]
    if (action !== undefined) {
      dispatch({ type: action, payload: {} })
    } else {
      console.log('Key down', keyCombination)
    }
  }, [bindings, dispatch])
  useEffect(() => {
    window.addEventListener('keydown', keyDownListener, true)
    return () => window.removeEventListener('keydown', keyDownListener, true)
  }, [keyDownListener])
}
