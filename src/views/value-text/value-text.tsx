
import { useClassNames } from 'hooks/useClassNames'
import { useWindowResizeListener } from 'hooks/useWindowResizeListener'
import React, { useRef, useCallback, useLayoutEffect } from 'react'
import { ValueViewProps } from 'views/value/value'
import './value-text.scss'

export default function ValueTextView(props: ValueViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement|null>(null)

  // Auto resize textarea
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current !== null) {
      // Autoresize textarea
      const $textarea = textareaRef.current
      $textarea.style.height = ''
      $textarea.style.height = `${$textarea.scrollHeight}px`
    }
  }, [textareaRef])

  // Handle changes
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.value !== undefined) {
      resizeTextarea()
    }
    if (props.onChange) {
      props.onChange({
        type: props.value.type,
        value: event.target.value
      }, event)
    }
  }

  // Resize textarea on window resize and synchronously after all DOM mutations
  useLayoutEffect(resizeTextarea)
  useWindowResizeListener(resizeTextarea)

  return (
    <div className={useClassNames('value-text', props.modifiers)}>
      <textarea
        className="value-text__textarea"
        id={props.id}
        ref={textareaRef}
        value={props.value.value as string}
        disabled={props.disabled}
        tabIndex={0}
        onChange={onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        spellCheck={false}
        rows={1}
      />
    </div>
  )
}
