
import './value-boolean.scss'
import InputCheckboxView from '../input-checkbox/input-checkbox'
import { BooleanValue } from '@ciphereditor/types'
import { ValueViewProps } from '../../views/value/value'
import { renderClassName } from '../../lib/utils/dom'

export default function ValueBooleanView (
  props: ValueViewProps<BooleanValue>
): JSX.Element {
  const { value, onChange, readOnly, modifiers, ...inputCheckboxProps } = props
  return (
    <label className={renderClassName('value-boolean', modifiers)}>
      <InputCheckboxView
        value={props.value.data}
        onChange={(data, event) => onChange?.({ type: 'boolean', data }, event)}
        disabled={readOnly}
        {...inputCheckboxProps}
      />
    </label>
  )
}
