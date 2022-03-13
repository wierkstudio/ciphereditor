
import './value.scss'
import ValueBooleanView from 'views/value-boolean/value-boolean'
import ValueTextView from 'views/value-text/value-text'
import { ChangeEvent } from 'react'
import { TypedValue } from 'slices/blueprint/types/value'
import { ViewModifiers } from 'hooks/useClassName'

export type ValueViewProps = {
  id?: string
  value: TypedValue
  disabled?: boolean
  onFocus?: React.FocusEventHandler
  onBlur?: React.FocusEventHandler
  onChange?: (value: TypedValue, event: ChangeEvent) => void
  modifiers?: ViewModifiers
}

export default function ValueView(props: ValueViewProps) {
  // Choose underlying view based on type
  let TypedValueView = undefined
  switch (props.value.type) {
    case 'text':
      TypedValueView = ValueTextView
      break
    case 'boolean':
      TypedValueView = ValueBooleanView
      break
  }

  if (TypedValueView !== undefined) {
    return <TypedValueView {...props} />
  }

  return (
    <div
      id={props.id}
      className="value"
      tabIndex={0}
      onFocus={props.onFocus}
    >
      <p className="value__meta">Value type not viewable.</p>
    </div>
  )
}
