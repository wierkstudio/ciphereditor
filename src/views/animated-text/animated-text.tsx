
import './animated-text.scss'
import React, { useEffect, useLayoutEffect, useState } from 'react'

type AnimatedTextViewState = {
  last: string
  current: string
  animating: boolean
  triggered: boolean
}

export default React.memo(function AnimatedTextView(props: {
  children: string
}) {
  const text = props.children
  const [state, setState] = useState<AnimatedTextViewState>({
    last: '',
    current: text,
    animating: false,
    triggered: true,
  })

  useEffect(() => {
    if (!state.animating && text !== state.current) {
      setState({ last: state.current, current: text, animating: true, triggered: false })
    }
  })

  useLayoutEffect(() => {
    if (state.animating && !state.triggered) {
      // Trigger transition after paint
      setTimeout(() => {
        setState({ ...state, triggered: true })
      }, 100)

      // Trigger next transition or clean up
      setTimeout(() => {
        if (text !== state.current) {
          setState({ last: state.current, current: text, animating: true, triggered: false })
        } else {
          setState({ ...state, animating: false, triggered: true })
        }
      }, 800)
    }
  }, [state, setState])

  return (
    <span className="animated-text">
      <span className={'animated-text__last' + (!state.triggered ? ' animated-text__last--trigger' : '')}>
        {state.animating && state.last}
      </span>
      <span className={'animated-text__current' + (!state.triggered ? ' animated-text__current--trigger' : '')}>
        {state.current}
      </span>
    </span>
  )
})
