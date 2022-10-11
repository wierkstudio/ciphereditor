
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

interface DragMoveState {
  pointerId: number
  dragging: boolean
  lastX: number
  lastY: number
}

const usePointerDrag = (
  dragMoveHandler: (deltaX: number, deltaY: number) => void,
  inverse: boolean = false
): MouseEventHandler => {
  const [pointerDown, setPointerDown] = useState<boolean>(false)
  const stateRef = useRef<DragMoveState | undefined>(undefined)

  const onPointerDown = useCallback((event: ReactPointerEvent) => {
    if (event.isPrimary && event.buttons === 1) {
      event.stopPropagation()
      releaseOptionalPointerCapture(event)
      stateRef.current = {
        pointerId: event.pointerId,
        dragging: false,
        lastX: event.clientX,
        lastY: event.clientY
      }
      setPointerDown(true)
    }
  }, [stateRef, setPointerDown])

  const onPointerMove = useCallbackRef((event: PointerEvent) => {
    const state = stateRef.current
    if (state?.pointerId === event.pointerId) {
      const x = event.clientX
      const y = event.clientY

      const deltaX = (inverse ? -1 : 1) * (x - state.lastX)
      const deltaY = (inverse ? -1 : 1) * (y - state.lastY)

      if (deltaX !== 0 || deltaY !== 0) {
        // Update state
        stateRef.current = { ...state, dragging: true, lastX: x, lastY: y }

        // Call drag move handler
        dragMoveHandler(deltaX, deltaY)

        // Show grabbing cursor
        if (!state.dragging) {
          document.body.classList.add('body-grabbing')
        }
      }
    }
  }, [stateRef, inverse])

  const onPointerEnd = useCallbackRef((event: PointerEvent) => {
    if (stateRef.current?.dragging === true) {
      document.body.classList.remove('body-grabbing')
    }
    stateRef.current = undefined
    setPointerDown(false)
  }, [stateRef, setPointerDown])

  usePointerFollowUp(onPointerMove, onPointerEnd, pointerDown)
  return onPointerDown
}

export default usePointerDrag
