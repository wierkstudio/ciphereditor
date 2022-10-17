
import './input-text.scss'
import IconView, { Icon } from '../icon/icon'
import React, { useRef, ChangeEvent } from 'react'
import useKeyBindingHandler from '../../hooks/useKeyBindingHandler'
import { renderClassName, ViewModifiers } from '../../lib/utils/dom'

/**
 * List of shortcuts that should not further propagate from the text input
 * (i.e. triggering for both the text input and the application)
 */
const stopPropagationForShortcuts = [
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowup',
  'backspace',
  'control+shift+z',
  'control+y',
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
  const { leadingIcon, value, onChange, modifiers, ...textareaProps } = props
  const textareaRef = useRef<HTMLTextAreaElement|null>(null)

  useKeyBindingHandler(textareaRef.current, (shortcut, event) => {
    if (stopPropagationForShortcuts.includes(shortcut)) {
      event.stopPropagation()
    }
  })

  const onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (onChange !== undefined) {
      onChange(event.currentTarget.value, event)
    }
  }

  return (
    <label className={renderClassName('input-text', modifiers)}>
      {leadingIcon !== undefined && (
        <div className='input-text__leading-icon'>
          <IconView icon={leadingIcon} />
        </div>
      )}
      <div className='input-text__field' data-autogrow-value={value}>
        <textarea
          className='input-text__textarea'
          value={value}
          ref={textareaRef}
          tabIndex={0}
          onChange={onTextareaChange}
          spellCheck={false}
          autoComplete='off'
          autoCorrect='off'
          rows={1}
          {...textareaProps}
        />
      </div>
    </label>
  )
}
