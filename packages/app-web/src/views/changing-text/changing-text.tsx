
import './changing-text.scss'
import React, { useEffect, useState } from 'react'
import { renderClassName } from '../../lib/utils/dom'

interface ChangingTextViewState {
  lastText: string
  currentText: string
  transitioned: boolean
  lastChangeTime: number | null
}

/**
 * Minimum number of ms that need to pass before triggering another full
 * change transition.
 */
const transitionCooldown = 5000

export default React.memo(function ChangingTextView (props: {
  children: string
}) {
  const text = props.children

  const [state, setState] = useState<ChangingTextViewState>({
    lastText: '',
    currentText: text,
    transitioned: true,
    lastChangeTime: null
  })

  useEffect(() => {
    if (text !== state.currentText) {
      const time = window.performance.now()
      const duration = state.lastChangeTime === null
        ? transitionCooldown
        : time - state.lastChangeTime

      if (duration < transitionCooldown) {
        // Schedule text replacement
        setState({
          ...state,
          currentText: text,
          lastChangeTime: time
        })
      } else {
        // Schedule full change transition
        setState({
          lastText: state.currentText,
          currentText: text,
          transitioned: false,
          lastChangeTime: time
        })
      }
    } else if (!state.transitioned) {
      // Trigger transition after paint
      const paintTimeout = setTimeout(() => {
        setState(state => ({ ...state, transitioned: true }))
      }, 50)

      return () => {
        clearTimeout(paintTimeout)
      }
    }
  }, [text, state, setState])

  const modifiers = !state.transitioned ? ['will-transition'] : []

  return (
    <span className={renderClassName('changing-text', modifiers)}>
      <span className='changing-text__last' aria-hidden>{state.lastText}</span>
      <span className='changing-text__current'>{state.currentText}</span>
    </span>
  )
})
