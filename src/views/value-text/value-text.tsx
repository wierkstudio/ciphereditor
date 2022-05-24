
import InputTextView from 'views/input-text/input-text'
import { TextValue } from '@app-types'
import { ValueViewProps } from 'views/value/value'

export default function ValueTextView (props: ValueViewProps<TextValue>): JSX.Element {
  return (
    <div className='value-text'>
      <InputTextView
        id={props.id}
        value={props.value.data}
        readOnly={props.readOnly}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onChange={(string, event) => {
          if (props.onChange !== undefined) {
            props.onChange({ type: 'text', data: string }, event)
          }
        }}
      />
    </div>
  )
}
