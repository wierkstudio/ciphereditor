
import { PointerEvent as ReactPointerEvent, useEffect, useState } from 'react'
import { euclideanDistance } from '../../lib/utils/math'
import { passiveListenerOptions } from '../../lib/utils/dom'

/**
 * Internal drag recognition states
 * - `undefined` for the initial state (pointer is up)
 * - Object bearing the start pointer coordinates (pointer is down/moving)
 * - `true` when the 'drag' gesture is assumed
 */
type DragRecognitionState = undefined | { startX: number, startY: number } | true

/**
 * Minimum move distance before a 'drag' gesture is assumed
 */
const minDragMoveDistance = 8.0

/**
 * Native HTMLButtonElement that can be clicked without interfering with a
 * movable parent element.
 */
export default function MovableButtonView (
  props: React.ComponentPropsWithoutRef<'button'>
): JSX.Element {
  const { onClick, onPointerUp, onPointerDown, ...buttonProps } = props
  const [state, setState] = useState<DragRecognitionState>(undefined)

  const onProxyPointerDown = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (onPointerDown !== undefined) {
      onPointerDown(event)
    }
    if (!event.isPropagationStopped()) {
      setState({ startX: event.clientX, startY: event.clientY })
    }
  }

  const onProxyClick = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (state !== true) {
      if (onPointerUp !== undefined) {
        onPointerUp(event)
      }
      if (onClick !== undefined) {
        onClick(event)
      }
    }
    setState(undefined)
  }

  useEffect(() => {
    const onMove = (event: PointerEvent): void => {
      if (state !== undefined && state !== true) {
        const distance = euclideanDistance(
          state.startX, state.startY, event.clientX, event.clientY)
        if (distance >= minDragMoveDistance) {
          setState(true)
        }
      }
    }
    const registerFollowUpEvents = (): void => {
      window.addEventListener('pointermove', onMove, passiveListenerOptions)
    }
    const removeFollowUpEvents = (): void => {
      window.removeEventListener('pointermove', onMove, passiveListenerOptions)
    }
    if (state !== undefined && state !== true) {
      registerFollowUpEvents()
    } else {
      removeFollowUpEvents()
    }
    return removeFollowUpEvents
  }, [state])

  return (
    <button
      onPointerDown={onProxyPointerDown}
      onClick={onProxyClick}
      onPointerUp={onPointerUp}
      {...buttonProps}
    />
  )
}
