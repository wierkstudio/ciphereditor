
import ControlView from 'views/control/control'
import { enterProgramAction, selectNodeAction } from 'slices/blueprint'
import { getNodeChildren, getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { BlueprintNode, BlueprintNodeType } from 'types/blueprint'
import { ControlNode } from 'types/control'
import { useAppDispatch, useBlueprintSelector } from 'utils/hooks'
import { ProgramNode } from 'types/program'
import './node.scss'

export default function Node(props: {
  node: BlueprintNode
  program: ProgramNode
}) {
  const dispatch = useAppDispatch()
  const selectedNode = useBlueprintSelector(state => getSelectedNode(state))
  let controls = useBlueprintSelector(state => getNodeChildren(state, props.node.id, BlueprintNodeType.Control)) as ControlNode[]
  if (props.node.type === BlueprintNodeType.Control) {
    controls.push(props.node as ControlNode)
  }

  const classNames = ['node']
  if (selectedNode?.id === props.node.id) {
    classNames.push('node--active')
  }
  return (
    <div
      className={classNames.join(' ')}
      role="region"
      tabIndex={0}
      onFocus={() => dispatch(selectNodeAction({ nodeId: props.node.id }))}
      onDoubleClick={() =>
        props.node.type === BlueprintNodeType.Program && dispatch(enterProgramAction({ programId: props.node.id }))}
    >
      <h3 className="node__label">{(props.node as any).label ?? `${props.node.type} #${props.node.id}`}</h3>
      <div className="node__controls">
        {controls.map(node => (
          <ControlView key={node.id} control={node} program={props.program} />
        ))}
      </div>
    </div>
  )
}
