
import { useLayoutEffect, useRef } from 'react'

const useWindowResizeListener = (listener: (event: UIEvent) => any): void => {
  const latestListener = useRef(listener)
  useLayoutEffect(() => {
    latestListener.current = listener
  })
  useLayoutEffect(() => {
    const handler: typeof listener = (event) => {
      latestListener.current(event)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])
}

export default useWindowResizeListener
