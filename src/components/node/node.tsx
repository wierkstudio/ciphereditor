
import Control from 'components/control/control'
import { enterProgramAction, selectNodeAction } from 'slices/blueprint'
import { getNodeChildren, getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { BlueprintNode, BlueprintNodeType } from 'types/blueprint'
import { ControlNode } from 'types/control'
import { useAppDispatch, useAppSelector } from 'utils/hooks'

type NodeProps = {
  node: BlueprintNode
}

function Node(props: NodeProps) {
  const dispatch = useAppDispatch()
  const selectedNode = useAppSelector(state => getSelectedNode(state.blueprint))
  const controls = useAppSelector(state => getNodeChildren(state.blueprint, props.node.id, BlueprintNodeType.Control)) as ControlNode[]
  const classNames = ['node']
  if (selectedNode?.id === props.node.id) {
    classNames.push('node--active')
  }
  return (
    <div
      className={classNames.join(' ')}
      onClick={() => dispatch(selectNodeAction({ nodeId: props.node.id }))}
      onDoubleClick={() =>
        props.node.type === BlueprintNodeType.Program && dispatch(enterProgramAction({ programId: props.node.id }))}
    >
      <h3>{props.node.type + ' #' + props.node.id}</h3>
      <div className="node__controls">
        {controls.map(node => (
          <Control control={node} />
        ))}
      </div>
    </div>
  )
}

export default Node
