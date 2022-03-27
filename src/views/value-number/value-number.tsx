
import './value-number.scss'
import ButtonView from 'views/button/button'
import InputTextView from 'views/input-text/input-text'
import { BaseSyntheticEvent, ChangeEvent, FocusEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { ValueViewProps } from 'views/value/value'
import { isNumericString } from 'utils/string'
import { TypedValue } from 'slices/blueprint/types/value'

export default function ValueNumberView(props: ValueViewProps) {
  const { onChange, onBlur, value, readOnly } = props

  const [stringValue, setStringValue] = useState(value.value.toString())

  const onValueChange = (value: TypedValue, event: BaseSyntheticEvent) => {
    if (onChange) {
      onChange(value, event)
    }
  }

  const onInputChange = (value: string, event: ChangeEvent) => {
    setStringValue(value)
    if (isNumericString(value)) {
      const valueNumber = parseFloat(value)
      const valueType = Number.isInteger(valueNumber) ? 'integer' : 'number'
      onValueChange({ value: valueNumber, type: valueType }, event)
    }
  }

  const onInputBlur = useCallback((event: FocusEvent) => {
    setStringValue(value.value.toString())
    if (onBlur) {
      onBlur(event)
    }
  }, [value, setStringValue, onBlur])

  const onMinusClick = (event: MouseEvent) => {
    onValueChange({ value: value.value - 1, type: value.type }, event)
  }

  const onPlusClick = (event: MouseEvent) => {
    onValueChange({ value: value.value + 1, type: value.type }, event)
  }

  useEffect(() => {
    setStringValue(value.value.toString())
  }, [value])

  return (
    <div className="value-number">
      {!readOnly && (
        <ButtonView icon="minus" onClick={onMinusClick} />
      )}
      <div className="value-number__input">
        <InputTextView
          id={props.id}
          value={stringValue}
          readOnly={props.readOnly}
          onFocus={props.onFocus}
          onBlur={onInputBlur}
          onChange={onInputChange}
        />
      </div>
      {!readOnly && (
        <ButtonView icon="plus" onClick={onPlusClick} />
      )}
    </div>
  )
}
