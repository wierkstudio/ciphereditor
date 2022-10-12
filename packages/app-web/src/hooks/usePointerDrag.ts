
import {
  MouseEventHandler,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState
} from 'react'
import { releaseOptionalPointerCapture } from '../lib/utils/dom'
import useCallbackRef from './useCallbackRef'
import usePointerFollowUp from './usePointerFollowUp'

export type PointerDragState = 'pointerdown' | 'pointermove' | 'pointerup'

export type PointerDragHandler = (
  state: PointerDragState,
  deltaX: number,
  deltaY: number
) => void

interface DragMoveState {
  pointerId: number
  dragging: boolean
  lastX: number
  lastY: number
}

const usePointerDrag = (handler: PointerDragHandler): MouseEventHandler => {
  const [pointerDown, setPointerDown] = useState<boolean>(false)
  const stateRef = useRef<DragMoveState | undefined>(undefined)

  const onPointerDown = useCallback((event: ReactPointerEvent) => {
    if (event.isPrimary && event.buttons === 1) {
      event.stopPropagation()
      releaseOptionalPointerCapture(event)

      // Call drag handler
      handler('pointerdown', 0, 0)

      // Update state
      stateRef.current = {
        pointerId: event.pointerId,
        dragging: false,
        lastX: event.clientX,
        lastY: event.clientY
      }
      setPointerDown(true)
    }
  }, [handler, stateRef, setPointerDown])

  const onPointerMove = useCallbackRef((event: PointerEvent) => {
    const state = stateRef.current
    if (state?.pointerId === event.pointerId) {
      if (event.clientX !== state.lastX || event.clientY !== state.lastY) {
        // Call drag handler
        handler(
          'pointermove',
          event.clientX - state.lastX,
          event.clientY - state.lastY
        )

        // Show grabbing cursor
        if (!state.dragging) {
          document.body.classList.add('body-grabbing')
        }

        // Update state
        stateRef.current = {
          ...state,
          dragging: true,
          lastX: event.clientX,
          lastY: event.clientY
        }
      }
    }
  }, [handler, stateRef])

  const onPointerEnd = useCallbackRef((event: PointerEvent) => {
    const state = stateRef.current
    if (state?.pointerId === event.pointerId) {
      // Call drag handler
      handler(
        'pointerup',
        event.clientX - state.lastX,
        event.clientY - state.lastY
      )

      // Hide grabbing cursor
      if (state.dragging) {
        document.body.classList.remove('body-grabbing')
      }

      // Update state
      stateRef.current = undefined
      setPointerDown(false)
    }
  }, [handler, stateRef, setPointerDown])

  usePointerFollowUp(onPointerMove, onPointerEnd, pointerDown)
  return onPointerDown
}

export default usePointerDrag
