
import InputTextView from '../../views/input-text/input-text'
import { ValueViewProps } from '../../views/value/value'

export default function ValueTextView (props: ValueViewProps<string>): JSX.Element {
  return (
    <div className='value-text'>
      <InputTextView
        id={props.id}
        value={props.value}
        placeholder='(empty)'
        readOnly={props.readOnly}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onChange={props.onChange}
        modifiers='slim'
      />
    </div>
  )
}
