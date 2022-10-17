
import './value-boolean.scss'
import InputCheckboxView from '../input-checkbox/input-checkbox'
import { ValueViewProps } from '../../views/value/value'
import { renderClassName } from '../../lib/utils/dom'

export default function ValueBooleanView (
  props: ValueViewProps<boolean>
): JSX.Element {
  const { value, onChange, readOnly, modifiers, ...inputCheckboxProps } = props
  return (
    <label className={renderClassName('value-boolean', modifiers)}>
      <InputCheckboxView
        value={props.value}
        onChange={(value, event) => onChange?.(value, event)}
        disabled={readOnly}
        {...inputCheckboxProps}
      />
    </label>
  )
}
