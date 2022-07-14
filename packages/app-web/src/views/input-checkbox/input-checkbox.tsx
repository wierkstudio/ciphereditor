
import './input-checkbox.scss'
import { ChangeEvent } from 'react'
import { renderClassName, ViewModifiers } from '../../utils/dom'

type InputCheckboxViewProps =
  Omit<React.ComponentPropsWithoutRef<'input'>, 'value' | 'onChange'> & {
    value?: boolean
    onChange?: (value: boolean, event: ChangeEvent) => void
    modifiers?: ViewModifiers
  }

export default function InputCheckboxView (
  props: InputCheckboxViewProps
): JSX.Element {
  const { value, onChange, modifiers, ...inputProps } = props

  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) {
      onChange(event.target.checked, event)
    }
  }

  return (
    <label className={renderClassName('input-checkbox', modifiers)}>
      <input
        className='input-checkbox__input'
        type='checkbox'
        checked={value}
        onChange={onInputChange}
        {...inputProps}
      />
      <div className='input-checkbox__track'>
        <div className='input-checkbox__thumb' />
      </div>
    </label>
  )
}
