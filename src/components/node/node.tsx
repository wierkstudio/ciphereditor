
import { enterProgram, selectNode } from 'slices/blueprint'
import { getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { BlueprintNode } from 'types/blueprint'
import { useAppDispatch, useAppSelector } from 'utils/hooks'

type NodeProps = {
  node: BlueprintNode
}

function Node(props: NodeProps) {
  const dispatch = useAppDispatch()
  const selectedNode = useAppSelector(state => getSelectedNode(state.blueprint))
  const classNames = ['node']
  if (selectedNode?.id === props.node.id) {
    classNames.push('node--active')
  }
  return (
    <div
      className={classNames.join(' ')}
      onClick={() => dispatch(selectNode({ nodeId: props.node.id }))}
      onDoubleClick={() => dispatch(enterProgram({ programId: props.node.id }))}
    >
      {props.node.id}
    </div>
  )
}

export default Node
