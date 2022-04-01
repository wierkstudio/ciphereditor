
import InputTextView from 'views/input-text/input-text'
import { BaseSyntheticEvent, ChangeEvent, FocusEvent, useCallback, useEffect, useState } from 'react'
import { TypedValue } from 'slices/blueprint/types/value'
import { ValueViewProps } from 'views/value/value'
import { bytesToHexString, hexStringToBytes } from 'utils/binary'
import { isHexString } from 'utils/string'
import { equalValues } from 'slices/blueprint/reducers/value'

const valueToString = (value: TypedValue): string =>
  bytesToHexString(value.value as Uint8Array)

const stringToValue = (string: string): TypedValue =>
  ({ value: hexStringToBytes(string), type: 'bytes' })

export default function ValueBytesView (props: ValueViewProps): JSX.Element {
  const { onChange, onFocus, onBlur, value, readOnly = false } = props

  const [stringValue, setStringValue] = useState(valueToString(value))

  const onValueChange = (value: TypedValue, event: BaseSyntheticEvent): void => {
    if (onChange !== undefined) {
      onChange(value, event)
    }
  }

  const onInputChange = (string: string, event: ChangeEvent): void => {
    setStringValue(string)
    if (isHexString(string)) {
      const newValue = stringToValue(string)
      if (!equalValues(value, newValue)) {
        onValueChange(newValue, event)
      }
    }
  }

  const onInputBlur = useCallback((event: FocusEvent) => {
    setStringValue(valueToString(value))
    if (onBlur !== undefined) {
      onBlur(event)
    }
  }, [value, setStringValue, onBlur])

  useEffect(() => {
    setStringValue(valueToString(value))
  }, [value])

  return (
    <div className='value-bytes'>
      <div className='value-bytes__input'>
        <InputTextView
          id={props.id}
          value={stringValue}
          readOnly={readOnly}
          onFocus={onFocus}
          onBlur={onInputBlur}
          onChange={onInputChange}
        />
      </div>
    </div>
  )
}
