
import './input-text.scss'
import React, { useRef, useCallback, useLayoutEffect, ChangeEvent } from 'react'
import useShortcutHandler from '../../hooks/useShortcutHandler'
import useWindowResizeListener from '../../hooks/useWindowResizeListener'
import { renderClassName, ViewModifiers } from '../../utils/dom'
import IconView, { Icon } from '../icon/icon'

/**
 * List of shortcuts that should not further propagate from the text input
 * (i.e. triggering for both the text input and the application)
 */
const stopPropagationForShortcuts = [
  'backspace',
  'control+shift+z',
  'control+z',
  'delete',
  'meta+z',
  'shift+meta+z'
]

type InputTextViewProps =
  Omit<React.ComponentPropsWithoutRef<'textarea'>, 'value' | 'onChange'> & {
    value?: string
    onChange?: (value: string, event: ChangeEvent) => void
    leadingIcon?: Icon
    modifiers?: ViewModifiers
  }

/**
 * Component for single and multiline text.
 */
export default function InputTextView (props: InputTextViewProps): JSX.Element {
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

  // Shortcuts
  useShortcutHandler(textareaRef.current, (shortcut, event) => {
    if (stopPropagationForShortcuts.includes(shortcut)) {
      event.stopPropagation()
    }
  })

  // Handle changes
  const onInternalChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (event.currentTarget.value !== undefined) {
      resizeTextarea()
    }
    if (onChange !== undefined) {
      onChange(event.currentTarget.value, event)
    }
  }

  // Resize textarea on window resize and synchronously after all DOM mutations
  useLayoutEffect(resizeTextarea)
  useWindowResizeListener(resizeTextarea)

  return (
    <label className={renderClassName('input-text', modifiers)}>
      {props.leadingIcon !== undefined && (
        <div className='input-text__leading-icon'>
          <IconView icon={props.leadingIcon} />
        </div>
      )}
      <textarea
        className='input-text__textarea'
        ref={textareaRef}
        tabIndex={0}
        onChange={onInternalChange}
        spellCheck={false}
        autoComplete='off'
        autoCorrect='off'
        rows={1}
        {...textareaProps}
      />
    </label>
  )
}
