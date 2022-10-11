
import {
  MouseEventHandler,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useState
} from 'react'
import { releaseOptionalPointerCapture } from '../lib/utils/dom'
import useCallbackRef from './useCallbackRef'
import usePointerFollowUp from './usePointerFollowUp'

interface DragMoveState {
  pointerId: number
  startX: number
  startY: number
  startViewportX: number
  startViewportY: number
}

// TODO: Measure initial system font size
// Example: parseInt(window.getComputedStyle(document.documentElement).fontSize)
export const gridSize = 16.0

const useDragMove = (
  x: number,
  y: number,
  onDragMove: (newX: number, newY: number) => void,
  inverse: boolean = false
): MouseEventHandler => {
  const [state, setState] = useState<DragMoveState | undefined>(undefined)

  const onPointerDown = useCallback((event: ReactPointerEvent) => {
    if (event.isPrimary && event.buttons === 1) {
      event.stopPropagation()
      releaseOptionalPointerCapture(event)
      const startViewportX = event.clientX
      const startViewportY = event.clientY
      setState({
        pointerId: event.pointerId,
        startX: x,
        startY: y,
        startViewportX,
        startViewportY
      })
    }
  }, [setState, x, y])

  const onPointerMove = useCallbackRef((event: PointerEvent) => {
    if (state?.pointerId === event.pointerId) {
      const newX = state.startX + (inverse ? -1 : 1) * Math.round((event.clientX - state.startViewportX) / gridSize) * gridSize
      const newY = state.startY + (inverse ? -1 : 1) * Math.round((event.clientY - state.startViewportY) / gridSize) * gridSize
      if (newX !== x || newY !== y) {
        onDragMove(newX, newY)
        // TODO: Optimize this call
        document.body.classList.add('body-grabbing')
      }
    }
  }, [state, inverse, x, y])

  const onPointerEnd = useCallbackRef((event: PointerEvent) => {
    if (state?.pointerId === event.pointerId) {
      setState(undefined)
      // TODO: Optimize this call
      document.body.classList.remove('body-grabbing')
    }
  }, [state, setState])

  usePointerFollowUp(onPointerMove, onPointerEnd, state !== undefined)
  return onPointerDown
}

export default useDragMove
