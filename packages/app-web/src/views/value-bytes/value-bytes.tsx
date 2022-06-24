
import InputTextView from '../../views/input-text/input-text'
import { BaseSyntheticEvent, ChangeEvent, FocusEvent, useCallback, useEffect, useState } from 'react'
import { BytesValue, TypedValue } from '@ciphereditor/types'
import { ValueViewProps } from '../../views/value/value'
import { bufferToHexString, hexStringToBuffer } from '../../utils/binary'
import { equalValues } from '../../slices/blueprint/reducers/value'
import { isHexString } from '../../utils/string'

const valueToString = (value: TypedValue): string =>
  bufferToHexString(value.data as ArrayBuffer)

const stringToValue = (string: string): TypedValue =>
  ({ type: 'bytes', data: hexStringToBuffer(string) })

export default function ValueBytesView (props: ValueViewProps<BytesValue>): JSX.Element {
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
