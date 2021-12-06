
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../store'
import type { RootState } from 'slices'
import { useCallback, useEffect } from 'react'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * Hook registering the given shortcut bindings
 */
export const useAppShortcuts = (bindings: { [type: string]: string }) => {
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
