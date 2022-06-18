
import './value-number.scss'
import ButtonView from 'views/button/button'
import InputTextView from 'views/input-text/input-text'
import { BaseSyntheticEvent, ChangeEvent, FocusEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { ValueViewProps } from 'views/value/value'
import { isNumericString } from 'utils/string'
import { IntegerValue, NumberValue, TypedValue } from '@ciphereditor/types'

export default function ValueNumberView (props: ValueViewProps<NumberValue | IntegerValue>): JSX.Element {
  const { onChange, onBlur, value, readOnly = false } = props

  const [stringValue, setStringValue] = useState(value.data.toString())

  const onValueChange = (value: TypedValue, event: BaseSyntheticEvent): void => {
    if (onChange !== undefined) {
      onChange(value, event)
    }
  }

  const onInputChange = (value: string, event: ChangeEvent): void => {
    setStringValue(value)
    if (isNumericString(value)) {
      const valueNumber = parseFloat(value)
      const valueType = Number.isInteger(valueNumber) ? 'integer' : 'number'
      onValueChange({ type: valueType, data: valueNumber }, event)
    }
  }

  const onInputBlur = useCallback((event: FocusEvent) => {
    setStringValue(value.data.toString())
    if (onBlur !== undefined) {
      onBlur(event)
    }
  }, [value, setStringValue, onBlur])

  const onMinusClick = (event: MouseEvent): void => {
    onValueChange({ type: value.type, data: value.data - 1 }, event)
  }

  const onPlusClick = (event: MouseEvent): void => {
    onValueChange({ type: value.type, data: value.data + 1 }, event)
  }

  useEffect(() => {
    setStringValue(value.data.toString())
  }, [value])

  return (
    <div className='value-number'>
      {!readOnly && (
        <ButtonView icon='minus' onClick={onMinusClick} />
      )}
      <div className='value-number__input'>
        <InputTextView
          id={props.id}
          value={stringValue}
          readOnly={readOnly}
          onFocus={props.onFocus}
          onBlur={onInputBlur}
          onChange={onInputChange}
        />
      </div>
      {!readOnly && (
        <ButtonView icon='plus' onClick={onPlusClick} />
      )}
    </div>
  )
}
