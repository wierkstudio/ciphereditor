
import {
  MouseEvent as ReactMouseMove,
  useEffect,
  useState
} from 'react'

type MovableButtonViewProps = React.ComponentPropsWithoutRef<'button'>

enum MovableButtonState {
  MouseUp,
  MouseDown,
  MouseMove,
}

/**
 * Native HTMLButtonElement that can both be clicked and dragged.
 */
export default function MovableButtonView (props: MovableButtonViewProps): JSX.Element {
  const { onClick, onMouseUp, onMouseDown, ...buttonProps } = props

  const [state, setState] = useState(MovableButtonState.MouseUp)

  const onInternMouseDown = (event: ReactMouseMove<HTMLButtonElement>): void => {
    if (onMouseDown !== undefined) {
      onMouseDown(event)
    }
    if (!event.isPropagationStopped()) {
      setState(MovableButtonState.MouseDown)
    }
  }

  const onInternClick = (event: ReactMouseMove<HTMLButtonElement>): void => {
    if (state !== MovableButtonState.MouseMove) {
      if (onMouseUp !== undefined) {
        onMouseUp(event)
      }
      if (onClick !== undefined) {
        onClick(event)
      }
    }
    setState(MovableButtonState.MouseUp)
  }

  // TODO: Allow moving by less than grid size (to make clicking easier)
  useEffect(() => {
    const onMouseMove = (event: MouseEvent): void => {
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

  return (
    <button
      onMouseDown={onInternMouseDown}
      onClick={onInternClick}
      onMouseUp={onMouseUp}
      {...buttonProps}
    />
  )
}
