
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../store'
import type { RootState } from 'slices'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { BlueprintState } from 'types/blueprint'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * A hook to access the present blueprint state. This hook takes a blueprint
 * selector function as an argument.
 */
export const useBlueprintSelector: TypedUseSelectorHook<BlueprintState> = <TSelected = unknown>(
  selector: (state: BlueprintState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) =>
  useAppSelector(state => selector(state.blueprint.present), equalityFn)

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

export const useAppClassName = (name: string, modifiers: string[] = []) =>
  [name].concat(
    modifiers
      .filter(value => !!value)
      .map(modifier => name + '--' + modifier)
  ).join(' ')

export const useWindowResizeListener = (listener: (event: UIEvent) => any) => {
  const latestListener = useRef(listener)
  useLayoutEffect(() => {
    latestListener.current = listener
  })
  useLayoutEffect(() => {
    const handler: typeof listener = (event) => {
      latestListener.current(event)
    };
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])
};
