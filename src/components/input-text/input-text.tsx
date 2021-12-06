
import { useRef, useEffect, useCallback } from 'react'
import './input-text.scss'

type InputTextProps = {
  id?: string
  value: string
  placeholder?: string
  multiline?: boolean
  monospaceFont?: boolean
  onChange: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>
}

export default function InputText(props: InputTextProps) {
  // Reference to the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  let className = 'input-text'
  let value = props.value || ''

  const multiline = props.multiline === true
  if (!multiline) {
    // Remove newlines from value
    value = value.replace(/\r?\n|\r/g, '')
  } else {
    // Add multiline modifier
    className += ' input-text--multiline'
  }

  if (props.monospaceFont !== false) {
    className += ' input-text--monospace'
  }

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
  useEffect(autoresizeTextarea, [value, multiline, autoresizeTextarea])

  // Autoresize on window resize (the field dimensions might change)
  useEffect(() => {
    if (multiline) {
      window.addEventListener('resize', autoresizeTextarea)
      return () => {
        // TODO: Test if this works
        window.removeEventListener('resize', autoresizeTextarea)
      }
    }
  }, [multiline, autoresizeTextarea])

  return (
    <div className={className}>
      <textarea
        className="input-text__textarea"
        id={props.id}
        ref={textareaRef}
        value={value}
        placeholder={props.placeholder}
        tabIndex={0}
        onChange={event => {
          // Remove newline characters
          let value = event.target.value
          if (!multiline) {
            value = value.replace(/\r?\n|\r/g, '')
          }
          props.onChange(value, event)
        }}
        onClick={evt => evt.stopPropagation()}
        onFocus={props.onFocus}
        onKeyDown={event => {
          // Disable new line key in non-multiline field
          if (event.key === 'Enter' && !multiline) {
            event.preventDefault()
          }
        }}
        spellCheck={false}
        rows={1} />
    </div>
  )
}
