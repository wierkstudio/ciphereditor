
import './operation.scss'
import ControlView from 'views/control/control'
import { BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { OperationNode } from 'slices/blueprint/types/operation'
import { ProgramNode } from 'slices/blueprint/types/program'
import { ReactComponent as SwitchIcon } from 'icons/switch.svg'
import { enterProgramAction, selectNodeAction } from 'slices/blueprint'
import { getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { useAppDispatch, useBlueprintSelector } from 'utils/hooks'

export default function OperationView(props: {
  operation: OperationNode|ProgramNode
  program: ProgramNode
}) {
  const { operation } = props
  const dispatch = useAppDispatch()
  let controls = useBlueprintSelector(state => getNodeChildren(state, operation.id, BlueprintNodeType.Control)) as ControlNode[]

  let doubleClickHandler = undefined
  if (operation.type === BlueprintNodeType.Program) {
    doubleClickHandler = () =>
      dispatch(enterProgramAction({ programId: operation.id }))
  }

  // TODO: Right now, we assume that the last control conveys the 'result' of
  // the operation. Therefore we show the operation header above it. From a
  // semantic perspective the header contains the headline for the entire
  // operation and thus, it appears first in the DOM.

  return (
    <div
      className="operation"
      role="region"
      tabIndex={0}
      onFocus={() => dispatch(selectNodeAction({ nodeId: operation.id }))}
      onDoubleClick={doubleClickHandler}
    >
      <header className="operation__header" style={{ order: controls.length - 1 }}>
        <span className="operation__icon">
          <SwitchIcon />
        </span>
        <h3 className="operation__label">
          {operation.label}
        </h3>
      </header>
      {controls.map((node, index) => (
        <div key={node.id} className="operation__control" style={{ order: index }}>
          <ControlView control={node} program={props.program} />
        </div>
      ))}
    </div>
  )
}
