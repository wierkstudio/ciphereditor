
import './value-number.scss'
import ButtonView from '../../views/button/button'
import InputTextView from '../../views/input-text/input-text'
import useTranslation from '../../hooks/useTranslation'
import { BaseSyntheticEvent, ChangeEvent, FocusEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { ValueViewProps } from '../../views/value/value'
import { isNumericString } from '../../lib/utils/string'

export default function ValueNumberView (props: ValueViewProps<number>): JSX.Element {
  const { onChange, onBlur, value, readOnly = false } = props

  const [t] = useTranslation()
  const [stringValue, setStringValue] = useState(value.toString())

  const onValueChange = (value: number, event: BaseSyntheticEvent): void => {
    if (onChange !== undefined) {
      onChange(value, event)
    }
  }

  const onInputChange = (value: string, event: ChangeEvent): void => {
    setStringValue(value)
    if (isNumericString(value)) {
      onValueChange(parseFloat(value), event)
    }
  }

  const onInputBlur = useCallback((event: FocusEvent) => {
    setStringValue(value.toString())
    if (onBlur !== undefined) {
      onBlur(event)
    }
  }, [value, setStringValue, onBlur])

  const onMinusClick = (event: MouseEvent): void => {
    onValueChange(value - 1, event)
  }

  const onPlusClick = (event: MouseEvent): void => {
    onValueChange(value + 1, event)
  }

  useEffect(() => {
    setStringValue(value.toString())
  }, [value])

  return (
    <div className='value-number'>
      {!readOnly && (
        <ButtonView
          title={t('Decrease value')}
          icon='minus'
          onClick={onMinusClick}
        />
      )}
      <div className='value-number__input'>
        <InputTextView
          id={props.id}
          value={stringValue}
          readOnly={readOnly}
          onFocus={props.onFocus}
          onBlur={onInputBlur}
          onChange={onInputChange}
          modifiers='slim'
        />
      </div>
      {!readOnly && (
        <ButtonView
          title={t('Increase value')}
          icon='plus'
          onClick={onPlusClick}
        />
      )}
    </div>
  )
}
