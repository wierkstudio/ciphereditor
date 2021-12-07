
import { ValueViewProps } from 'views/value/value'
import './value-boolean.scss'

export default function ValueBooleanView(props: ValueViewProps) {
  return (
    <label className="value-boolean">
      <input
        className="value-boolean__input"
        id={props.id}
        type="checkbox"
        checked={props.value.value}
        onChange={event => props.onChange({ value: event.target.checked, type: 'boolean' }, event)}
      />
      <div className="value-boolean__track">
        <div className="value-boolean__thumb"></div>
      </div>
    </label>
  )
}
