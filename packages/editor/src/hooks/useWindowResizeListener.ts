
import { useLayoutEffect, useRef } from 'react'

/**
 * Call the given listener function initially and on window resize
 */
const useWindowResizeListener = (listener: () => any): void => {
  const latestListener = useRef(listener)
  useLayoutEffect(() => {
    latestListener.current = listener
  })
  useLayoutEffect(() => {
    const handler: typeof listener = () => {
      latestListener.current()
    }
    window.addEventListener('resize', handler)
    handler()
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])
}

export default useWindowResizeListener
