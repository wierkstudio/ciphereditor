
import { ControlText } from 'components/control-text/control-text'
import { useCallback } from 'react'
import { changeControlAction, selectNodeAction } from 'slices/blueprint'
import { getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { ControlNode } from 'types/control'
import { useAppDispatch, useAppSelector } from 'utils/hooks'
import './control.scss'

type ControlProps = {
  control: ControlNode
}

function Control(props: ControlProps) {
  const dispatch = useAppDispatch()
  const selectedNode = useAppSelector(state => getSelectedNode(state.blueprint))

  // Choose control view based on type
  let ControlView
  switch (props.control.value.type) {
    case 'text':
      ControlView = ControlText
      break
  }

  const classNames = ['control']
  if (selectedNode?.id === props.control.id) {
    classNames.push('control--active')
  }
  return (
    <div
      className={classNames.join(' ')}
      onFocus={() => dispatch(selectNodeAction({ nodeId: props.control.id }))}
    >
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
            tabIndex={0}
            value={props.control.enum.findIndex((element: any) => element[0] === props.control.value.value)}
            onChange={evt => dispatch(changeControlAction({
              controlId: props.control.id,
              change: { value: props.control.enum[parseInt(evt.target.value)][0] },
            }))}
            onFocus={event => {
              event.stopPropagation()
              dispatch(selectNodeAction({ nodeId: props.control.id }))
            }}
          >
            {(props.control.enum as any[][]).map((element: any, index: number) =>
              <option value={index} key={index}>
                {element[2] ?? element[0].toString()}
              </option>
            )}
          </select>
        ) : ControlView ? <ControlView control={props.control} /> : null}
      </div>
    </div>
  )
}

export default Control
