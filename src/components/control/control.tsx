
import InputText from 'components/input-text/input-text'
import { changeControlAction, selectNodeAction } from 'slices/blueprint'
import { getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { getLinkControl } from 'slices/blueprint/selectors/control'
import { ControlNode } from 'types/control'
import { useAppDispatch, useAppSelector } from 'utils/hooks'
import './control.scss'

type ControlProps = {
  control: ControlNode
}

function Control(props: ControlProps) {
  const dispatch = useAppDispatch()
  const selectedNode = useAppSelector(state => getSelectedNode(state.blueprint))

  const classNames = ['control']
  if (selectedNode?.id === props.control.id) {
    classNames.push('control--active')
  }
  return (
    <div
      className={classNames.join(' ')}>
      <label
        className="control__label"
        htmlFor={`node-${props.control.id}`}
      >
        {props.control.label}
      </label>
      <div className="control__input">
        {props.control.enum.length > 0 ? (
          <select
            className="control__select"
            id={`node-${props.control.id}`}
            value={props.control.enum.findIndex((element: any) => element[0] === props.control.value.value)}
            onChange={evt => dispatch(changeControlAction({
              controlId: props.control.id,
              change: { value: props.control.enum[parseInt(evt.target.value)][0] },
            }))}
            onClick={evt => evt.stopPropagation()}
            onFocus={() => dispatch(selectNodeAction({ nodeId: props.control.id }))}
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
            onFocus={() => dispatch(selectNodeAction({ nodeId: props.control.id }))}
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
