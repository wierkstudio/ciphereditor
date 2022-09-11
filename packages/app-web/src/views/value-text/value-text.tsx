
import InputTextView from '../../views/input-text/input-text'
import { TextValue } from '@ciphereditor/types'
import { ValueViewProps } from '../../views/value/value'
import { previewValue } from '../../slices/blueprint/reducers/value'

export default function ValueTextView (props: ValueViewProps<TextValue>): JSX.Element {
  return (
    <div className='value-text'>
      <InputTextView
        id={props.id}
        value={props.value.data}
        placeholder={previewValue({ type: 'text', data: '' })}
        readOnly={props.readOnly}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onChange={(string, event) => {
          if (props.onChange !== undefined) {
            props.onChange({ type: 'text', data: string }, event)
          }
        }}
        modifiers='slim'
      />
    </div>
  )
}
