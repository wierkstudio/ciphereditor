
import { MouseEvent as ReactMouseEvent, useCallback, useEffect, useState } from 'react'

interface DragMoveState {
  startX: number
  startY: number
  startViewportX: number
  startViewportY: number
}

export const gridSize = 16.0

const useDragMove = (
  x: number,
  y: number,
  onMove: (newX: number, newY: number) => void,
  inverse: boolean = false
): { onMouseDown: (event: ReactMouseEvent) => void } => {
  const [state, setState] = useState<DragMoveState | undefined>(undefined)

  const onMouseDown = useCallback((event: ReactMouseEvent) => {
    if (event.button === 0) {
      event.stopPropagation()
      const startViewportX = event.clientX
      const startViewportY = event.clientY
      setState({ startX: x, startY: y, startViewportX, startViewportY })
    }
  }, [setState, x, y])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent): void => {
      if (state !== undefined) {
        const newX = state.startX + (inverse ? -1 : 1) * Math.round((event.clientX - state.startViewportX) / gridSize) * gridSize
        const newY = state.startY + (inverse ? -1 : 1) * Math.round((event.clientY - state.startViewportY) / gridSize) * gridSize
        if (newX !== x || newY !== y) {
          onMove(newX, newY)
          // TODO: Optimize this call
          document.body.classList.add('body-grabbing')
        }
      }
    }
    const onMouseUp = (event: MouseEvent): void => {
      if (state !== undefined) {
        event.preventDefault()
        setState(undefined)
        document.body.classList.remove('body-grabbing')
      }
    }
    const listenerOptions: AddEventListenerOptions & EventListenerOptions =
      { passive: true }
    if (state !== undefined) {
      window.addEventListener('mousemove', onMouseMove, listenerOptions)
      window.addEventListener('mouseup', onMouseUp)
    } else {
      window.removeEventListener('mousemove', onMouseMove, listenerOptions)
      window.removeEventListener('mouseup', onMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove, listenerOptions)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [x, y, onMove, inverse, state, setState])

  return { onMouseDown }
}

export default useDragMove
