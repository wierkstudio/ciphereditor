
import { ValueViewProps } from 'views/value/value'
import InputTextView from 'views/input-text/input-text'

export default function ValueTextView (props: ValueViewProps): JSX.Element {
  return (
    <div className='value-text'>
      <InputTextView
        id={props.id}
        value={props.value.value}
        readOnly={props.readOnly}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onChange={(value, event) => {
          if (props.onChange !== undefined) {
            props.onChange({ value, type: 'text' }, event)
          }
        }}
      />
    </div>
  )
}
