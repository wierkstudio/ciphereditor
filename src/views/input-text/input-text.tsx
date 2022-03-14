
import './input-text.scss'
import React, { useRef, useCallback, useLayoutEffect, ChangeEvent, FocusEventHandler } from 'react'
import useClassName, { ViewModifiers } from 'hooks/useClassName'
import useWindowResizeListener from 'hooks/useWindowResizeListener'

/**
 * Component for single and multiline text.
 */
export default function InputTextView(props: {
  id?: string
  value?: string
  disabled?: boolean
  readonly?: boolean
  modifiers?: ViewModifiers
  onChange?: (value: string, event: ChangeEvent) => void
  onFocus?: FocusEventHandler
  onBlur?: FocusEventHandler
}) {
  const { onChange, modifiers, ...textareaProps } = props
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
  const onInternalChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.value !== undefined) {
      resizeTextarea()
    }
    if (onChange) {
      onChange(event.currentTarget.value, event)
    }
  }

  // Resize textarea on window resize and synchronously after all DOM mutations
  useLayoutEffect(resizeTextarea)
  useWindowResizeListener(resizeTextarea)

  return (
    <div className={useClassName('input-text', modifiers)}>
      <textarea
        className="input-text__textarea"
        ref={textareaRef}
        tabIndex={0}
        onChange={onInternalChange}
        spellCheck={false}
        rows={1}
        {...textareaProps}
      />
    </div>
  )
}
