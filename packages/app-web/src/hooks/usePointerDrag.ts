
import {
  MouseEventHandler,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState
} from 'react'
import useCallbackRef from './useCallbackRef'
import usePointerFollowUp from './usePointerFollowUp'
import { deltaPoint, Point, pointEqualTo } from '@ciphereditor/library'
import { releaseOptionalPointerCapture } from '../lib/utils/dom'

export type PointerDragState = 'start' | 'move' | 'end' | 'cancel'

export type PointerDragHandler = (
  state: PointerDragState,
  delta: Point,
  event: PointerEvent
) => void

interface DragMoveState {
  pointerId: number
  dragging: boolean
  lastPointerLocation: Point
}

const usePointerDrag = (handler: PointerDragHandler): MouseEventHandler => {
  const [pointerDown, setPointerDown] = useState<boolean>(false)
  const stateRef = useRef<DragMoveState | undefined>(undefined)

  const onPointerDown = useCallback((event: ReactPointerEvent) => {
    if (event.isPrimary && event.buttons === 1) {
      const pointerLocation = { x: event.clientX, y: event.clientY }
      event.stopPropagation()
      releaseOptionalPointerCapture(event)

      // Call drag handler
      const delta = { x: 0, y: 0 }
      handler('start', delta, event.nativeEvent)

      // Update state
      stateRef.current = {
        pointerId: event.pointerId,
        dragging: false,
        lastPointerLocation: pointerLocation
      }
      setPointerDown(true)
    }
  }, [handler, stateRef, setPointerDown])

  const onPointerMove = useCallbackRef((event: PointerEvent) => {
    const state = stateRef.current
    if (state?.pointerId === event.pointerId) {
      const pointerLocation = { x: event.clientX, y: event.clientY }
      if (!pointEqualTo(pointerLocation, state.lastPointerLocation)) {
        const delta = deltaPoint(pointerLocation, state.lastPointerLocation)

        // Call drag handler
        handler('move', delta, event)

        // Show grabbing cursor
        if (!state.dragging) {
          document.body.classList.add('body-grabbing')
        }

        // Update state
        stateRef.current = {
          ...state,
          dragging: true,
          lastPointerLocation: pointerLocation
        }
      }
    }
  }, [handler, stateRef])

  const onPointerEnd = useCallbackRef((event: PointerEvent) => {
    const state = stateRef.current
    if (state?.pointerId === event.pointerId) {
      const pointerLocation = { x: event.clientX, y: event.clientY }
      const delta = deltaPoint(pointerLocation, state.lastPointerLocation)

      // Call drag handler
      handler(state.dragging ? 'end' : 'cancel', delta, event)

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
