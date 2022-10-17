
import './value.scss'
import ValueBooleanView from '../../views/value-boolean/value-boolean'
import ValueBytesView from '../../views/value-bytes/value-bytes'
import ValueNumberView from '../../views/value-number/value-number'
import ValueTextView from '../../views/value-text/value-text'
import { BaseSyntheticEvent } from 'react'
import { ViewModifiers } from '../../lib/utils/dom'
import { identifySerializedValueType, labelType, SerializedValue } from '@ciphereditor/library'

export interface ValueViewProps<ValueType = SerializedValue> {
  id?: string
  value: ValueType
  readOnly?: boolean
  onFocus?: React.FocusEventHandler
  onBlur?: React.FocusEventHandler
  onChange?: (value: SerializedValue, event?: BaseSyntheticEvent) => void
  modifiers?: ViewModifiers
}

export default function ValueView (props: ValueViewProps): JSX.Element {
  // Choose underlying view based on type
  const { value, ...remainingProps } = props
  const valueType = identifySerializedValueType(value)
  switch (valueType) {
    case 'boolean':
      return <ValueBooleanView value={value as boolean} {...remainingProps} />
    case 'integer':
    case 'number':
      return <ValueNumberView value={value as number} {...remainingProps} />
    case 'text':
      return <ValueTextView value={value as string} {...remainingProps} />
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
        {/* TODO: Needs translation */}
        {`${labelType(valueType)} value is not viewable.`}
      </p>
    </div>
  )
}
