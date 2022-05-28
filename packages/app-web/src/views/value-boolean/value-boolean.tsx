
import './value-boolean.scss'
import { ValueViewProps } from 'views/value/value'
import { BooleanValue } from '@cryptii/types'

export default function ValueBooleanView (props: ValueViewProps<BooleanValue>): JSX.Element {
  return (
    <label className='value-boolean'>
      <input
        className='value-boolean__input'
        id={props.id}
        type='checkbox'
        checked={props.value.data}
        readOnly={props.readOnly}
        onChange={event => {
          if (props.onChange !== undefined) {
            props.onChange({ type: 'boolean', data: event.target.checked }, event)
          }
        }}
      />
      <div className='value-boolean__track'>
        <div className='value-boolean__thumb' />
      </div>
    </label>
  )
}
