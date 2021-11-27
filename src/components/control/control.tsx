
import InputText from 'components/input-text/input-text'
import { changeControlAction } from 'slices/blueprint'
import { ControlNode } from 'types/control'
import { useAppDispatch } from 'utils/hooks'

type ControlProps = {
  control: ControlNode
}

function Control(props: ControlProps) {
  const dispatch = useAppDispatch()
  return (
    <div className="control">
      <label className="control__label">{props.control.label}</label>
      <div className="control__input">
        <InputText
          value={props.control.value.value as string}
          onChange={value => dispatch(changeControlAction({
            controlId: props.control.id,
            change: { name: props.control.name, value: value }
          }))} />
      </div>
    </div>
  )
}

export default Control
