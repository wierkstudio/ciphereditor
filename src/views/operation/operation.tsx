
import './operation.scss'
import ControlView from 'views/control/control'
import { BlueprintNodeType } from 'types/blueprint'
import { ControlNode } from 'types/control'
import { OperationNode } from 'types/operation'
import { ProgramNode } from 'types/program'
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

  return (
    <div
      className="operation"
      role="region"
      tabIndex={0}
      onFocus={() => dispatch(selectNodeAction({ nodeId: operation.id }))}
      onDoubleClick={doubleClickHandler}
    >
      <header className="operation__header">
        <span className="operation__icon">
          <SwitchIcon />
        </span>
        <h3 className="operation__label">
          {operation.label}
        </h3>
      </header>
      {controls.map(node => (
        <div key={node.id} className="operation__control">
          <ControlView control={node} program={props.program} />
        </div>
      ))}
    </div>
  )
}
