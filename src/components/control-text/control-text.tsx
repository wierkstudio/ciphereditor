
import InputText from 'components/input-text/input-text'
import { changeControlAction, selectNodeAction } from 'slices/blueprint'
import { ControlNode } from 'types/control'
import { useAppDispatch } from 'utils/hooks'

type ControlTextProps = {
  control: ControlNode
}

export function ControlText(props: ControlTextProps) {
  const dispatch = useAppDispatch()
  return (
    <InputText
      id={`node-${props.control.id}`}
      value={props.control.value.value as string}
      onFocus={event => {
        event.stopPropagation()
        dispatch(selectNodeAction({ nodeId: props.control.id }))
      }}
      onChange={value => dispatch(changeControlAction({
        controlId: props.control.id,
        change: { value },
      }))}
    />
  )
}
