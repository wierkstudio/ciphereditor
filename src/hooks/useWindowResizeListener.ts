
import { useLayoutEffect, useRef } from 'react'

export default function useWindowResizeListener (listener: (event: UIEvent) => any) {
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
}
