
import { useRef, useEffect, useCallback } from 'react'
import { ValueViewProps } from 'views/value/value'
import './value-text.scss'

export default function ValueTextView(props: ValueViewProps) {
  // Reference to the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const value = props.value

  // Function defining how to autoresize the textarea
  const autoresizeTextarea = useCallback(() => {
    if (textareaRef.current !== null) {
      // Autoresize textarea
      const $textarea = textareaRef.current
      $textarea.style.height = ''
      $textarea.style.height = `${$textarea.scrollHeight}px`
    }
  }, [textareaRef])

  // Autoresize if value changes
  useEffect(autoresizeTextarea, [value, autoresizeTextarea])

  // Autoresize on window resize (the field dimensions might change)
  useEffect(() => {
    window.addEventListener('resize', autoresizeTextarea)
    return () => {
      // TODO: Test if this works
      window.removeEventListener('resize', autoresizeTextarea)
    }
  }, [autoresizeTextarea])

  return (
    <div className="value-text">
      <textarea
        className="value-text__textarea"
        id={props.id}
        ref={textareaRef}
        value={value.value as string}
        disabled={props.disabled}
        tabIndex={0}
        onChange={event => {
          props.onChange({
            type: value.type,
            value: event.target.value,
          }, event)
        }}
        onFocus={props.onFocus}
        spellCheck={false}
        rows={1}
      />
    </div>
  )
}
