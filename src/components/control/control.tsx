
import InputText from 'components/input-text/input-text'
import { changeControlAction, linkControlAction } from 'slices/blueprint'
import { getLinkControl } from 'slices/blueprint/selectors/control'
import { ControlNode } from 'types/control'
import { useAppDispatch, useAppSelector } from 'utils/hooks'

type ControlProps = {
  control: ControlNode
}

function Control(props: ControlProps) {
  const dispatch = useAppDispatch()
  const linked = useAppSelector(state => getLinkControl(state.blueprint))?.id === props.control.id
  return (
    <div className="control">
      <label className="control__label">{props.control.label}</label>
      <button onClick={() => dispatch(linkControlAction({ controlId: props.control.id }))}>
        {linked ? 'Unlink' : 'Link'}
      </button>
      <div className="control__input">
        {props.control.enum.length > 0 ? (
          <select
            id={`node-${props.control.id}`}
            onChange={evt => dispatch(changeControlAction({
              controlId: props.control.id,
              change: { value: props.control.enum[parseInt(evt.target.value)][0] },
            }))}
          >
            {(props.control.enum as any[][]).map((element: any, index: number) =>
              <option value={index} key={index}>
                {element[2] ?? element[0].toString()}
              </option>
            )}
          </select>
        ) : (
          <InputText
            id={`node-${props.control.id}`}
            value={props.control.value.value as string}
            onChange={value => dispatch(changeControlAction({
              controlId: props.control.id,
              change: { value },
            }))} />
        )}
      </div>
    </div>
  )
}

export default Control
