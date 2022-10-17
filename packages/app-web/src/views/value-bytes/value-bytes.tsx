
import InputTextView from '../../views/input-text/input-text'
import { BaseSyntheticEvent, ChangeEvent, FocusEvent, useCallback, useEffect, useState } from 'react'
import { ValueViewProps } from '../../views/value/value'
import { bufferToHexString, hexStringToBuffer } from '../../lib/utils/binary'
import { compareSerializedValues, extractValue, SerializedValue, serializeValue } from '@ciphereditor/library'
import { isHexString } from '../../lib/utils/string'

const valueToString = (value: SerializedValue): string =>
  bufferToHexString(extractValue(value) as ArrayBuffer)

const stringToValue = (string: string): SerializedValue =>
  (serializeValue(hexStringToBuffer(string)))

export default function ValueBytesView (props: ValueViewProps<SerializedValue>): JSX.Element {
  const { onChange, onFocus, onBlur, value, readOnly = false } = props

  const [stringValue, setStringValue] = useState(valueToString(value))

  const onValueChange = (value: SerializedValue, event: BaseSyntheticEvent): void => {
    if (onChange !== undefined) {
      onChange(value, event)
    }
  }

  const onInputChange = (string: string, event: ChangeEvent): void => {
    setStringValue(string)
    if (isHexString(string)) {
      const newValue = stringToValue(string)
      if (!compareSerializedValues(value, newValue)) {
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
          placeholder='(empty)'
          readOnly={readOnly}
          onFocus={onFocus}
          onBlur={onInputBlur}
          onChange={onInputChange}
          modifiers='slim'
        />
      </div>
    </div>
  )
}
