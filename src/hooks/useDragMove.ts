
import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useState
} from 'react'
import { passiveListenerOptions } from 'utils/dom'

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
): {
    onPointerDown: (event: ReactPointerEvent) => void
  } => {
  const [state, setState] = useState<DragMoveState | undefined>(undefined)

  const onPointerDown = useCallback((event: ReactPointerEvent) => {
    if (event.isPrimary) {
      event.stopPropagation()
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

  useEffect(() => {
    const onMove = (event: PointerEvent): void => {
      if (state?.pointerId === event.pointerId) {
        const clientX: number = event.clientX
        const clientY: number = event.clientY
        const newX = state.startX + (inverse ? -1 : 1) * Math.round((clientX - state.startViewportX) / gridSize) * gridSize
        const newY = state.startY + (inverse ? -1 : 1) * Math.round((clientY - state.startViewportY) / gridSize) * gridSize
        if (newX !== x || newY !== y) {
          onDragMove(newX, newY)
          // TODO: Optimize this call
          document.body.classList.add('body-grabbing')
        }
      }
    }
    const onEnd = (event: PointerEvent): void => {
      if (state?.pointerId === event.pointerId) {
        event.preventDefault()
        setState(undefined)
        document.body.classList.remove('body-grabbing')
      }
    }
    const registerFollowUpEvents = (): void => {
      window.addEventListener('pointermove', onMove, passiveListenerOptions)
      window.addEventListener('pointerup', onEnd)
      window.addEventListener('pointercancel', onEnd)
    }
    const removeFollowUpEvents = (): void => {
      window.removeEventListener('pointermove', onMove, passiveListenerOptions)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
    }
    if (state !== undefined) {
      registerFollowUpEvents()
    } else {
      removeFollowUpEvents()
    }
    return removeFollowUpEvents
  }, [x, y, onDragMove, inverse, state, setState])

  return { onPointerDown }
}

export default useDragMove
