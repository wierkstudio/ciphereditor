
import './value.scss'
import ValueBooleanView from 'views/value-boolean/value-boolean'
import ValueBytesView from 'views/value-bytes/value-bytes'
import ValueNumberView from 'views/value-number/value-number'
import ValueTextView from 'views/value-text/value-text'
import { BaseSyntheticEvent } from 'react'
import { TypedValue } from 'cryptii-types'
import { ViewModifiers } from 'utils/dom'
import { labelType } from 'slices/blueprint/reducers/value'

export interface ValueViewProps<ValueType = TypedValue> {
  id?: string
  value: ValueType
  readOnly?: boolean
  onFocus?: React.FocusEventHandler
  onBlur?: React.FocusEventHandler
  onChange?: (value: TypedValue, event?: BaseSyntheticEvent) => void
  modifiers?: ViewModifiers
}

export default function ValueView (props: ValueViewProps): JSX.Element {
  // Choose underlying view based on type
  const { value, ...remainingProps } = props
  switch (value.type) {
    case 'boolean':
      return <ValueBooleanView value={value} {...remainingProps} />
    case 'integer':
    case 'number':
      return <ValueNumberView value={value} {...remainingProps} />
    case 'text':
      return <ValueTextView value={value} {...remainingProps} />
    case 'bytes':
      return <ValueBytesView value={value} {...remainingProps} />
  }

  return (
    <div
      id={props.id}
      className='value'
      tabIndex={0}
      onFocus={props.onFocus}
    >
      <p className='value__meta'>
        {`${labelType((value as TypedValue).type)} value is not viewable.`}
      </p>
    </div>
  )
}
