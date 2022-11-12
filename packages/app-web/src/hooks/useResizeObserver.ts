
import { Size } from '@ciphereditor/library'
import { MutableRefObject, useEffect, useMemo, useRef } from 'react'

type ResizeObserverHandler = (size: Size) => void

const useResizeObserver = (
  elementRef: MutableRefObject<HTMLDivElement | null>,
  handler: ResizeObserverHandler
): void => {
  const handlerRef = useRef<ResizeObserverHandler | undefined>(undefined)

  const resizeObserver = useMemo(() => {
    return new ResizeObserver(entries => {
      if (entries.length === 1 && handlerRef.current !== undefined) {
        handlerRef.current({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        })
      }
    })
  }, [handlerRef])

  useEffect(() => {
    const element = elementRef.current
    handlerRef.current = handler
    if (element !== null) {
      // Start observing element
      resizeObserver.observe(element)

      // Initial observation
      const clientRect = element.getBoundingClientRect()
      handler({ width: clientRect.width, height: clientRect.height })

      return () => {
        // Stop observing element
        resizeObserver.unobserve(element)
      }
    }
  }, [resizeObserver, elementRef, handler])
}

export default useResizeObserver
