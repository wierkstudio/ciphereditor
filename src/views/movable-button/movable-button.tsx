
import {
  MouseEvent as ReactMouseMove,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useState,
} from 'react'

enum MovableButtonState {
  MouseUp,
  MouseDown,
  MouseMove,
}

export default function MovableButtonView(props: {
  children?: ReactNode
  className?: string
  onClick?: MouseEventHandler<Element>
  onMouseUp?: MouseEventHandler<Element>
}) {
  const { onClick, onMouseUp, ...buttonProps } = props

  const [state, setState] = useState(MovableButtonState.MouseUp)

  const onInternMouseDown = (event: ReactMouseMove) => {
    setState(MovableButtonState.MouseDown)
  }

  const onInternClick = (event: ReactMouseMove) => {
    if (state !== MovableButtonState.MouseMove) {
      onMouseUp && onMouseUp(event)
      onClick && onClick(event)
    }
    setState(MovableButtonState.MouseUp)
  }

  // TODO: Allow moving by less than grid size (to make clicking easier)
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (state === MovableButtonState.MouseDown) {
        setState(MovableButtonState.MouseMove)
      }
    }
    const listenerOptions: AddEventListenerOptions & EventListenerOptions =
      { passive: true, once: true }
    if (state === MovableButtonState.MouseDown) {
      window.addEventListener('mousemove', onMouseMove, listenerOptions)
    } else {
      window.removeEventListener('mousemove', onMouseMove, listenerOptions)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove, listenerOptions)
    }
  }, [state])

  return <button
    onMouseDown={onInternMouseDown}
    onClick={onInternClick}
    {...buttonProps}
  />
}
