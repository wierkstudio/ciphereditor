
import { MutableRefObject, useEffect } from 'react'
import { passiveListenerOptions } from 'utils/dom'

type PointerEventHandler = (event: PointerEvent) => void

const usePointerFollowUp = (
  moveHandler: MutableRefObject<PointerEventHandler> | PointerEventHandler,
  endHandler: MutableRefObject<PointerEventHandler> | PointerEventHandler,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (enabled) {
      const onPointerMove =
        typeof moveHandler === 'function'
          ? (event: PointerEvent): void => { moveHandler(event) }
          : (event: PointerEvent): void => { moveHandler.current(event) }

      const onPointerEnd =
        typeof endHandler === 'function'
          ? (event: PointerEvent): void => { endHandler(event) }
          : (event: PointerEvent): void => { endHandler.current(event) }

      window.addEventListener('pointermove', onPointerMove, passiveListenerOptions)
      window.addEventListener('pointerup', onPointerEnd)
      window.addEventListener('pointercancel', onPointerEnd)

      return () => {
        window.removeEventListener('pointermove', onPointerMove, passiveListenerOptions)
        window.removeEventListener('pointerup', onPointerEnd)
        window.removeEventListener('pointercancel', onPointerEnd)
      }
    }
  }, [moveHandler, endHandler, enabled])
}

export default usePointerFollowUp
