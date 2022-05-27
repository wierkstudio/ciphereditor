
import {
  DependencyList,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef
} from 'react'

/**
 * `useCallbackRef` returns a mutable ref object whose `.current` property is
 * initialized to a memoized version of the callback that only changes if one of
 * the `deps` has changed.
 */
const useCallbackRef = <C extends (...args: any[]) => any>(
  callback: C,
  deps: DependencyList
): MutableRefObject<C> => {
  // eslint-disable-next-line
  const memoCallback = useCallback(callback, deps)
  const ref = useRef<C>(memoCallback)
  useEffect(() => { ref.current = memoCallback }, [memoCallback])
  return ref
}

export default useCallbackRef
