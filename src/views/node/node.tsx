
import './node.scss'
import ControlView from 'views/control/control'
import OperationView from 'views/operation/operation'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { getNode, isSelectedNode } from 'slices/blueprint/selectors/blueprint'

export default function NodeView(props: {
  nodeId: BlueprintNodeId,
  contextProgramId: BlueprintNodeId,
}) {
  const { nodeId, contextProgramId } = props

  const node = useBlueprintSelector(state => getNode(state, nodeId))
  const isSelected = useBlueprintSelector(state => isSelectedNode(state, nodeId))

  return (
    <div className={useClassName('node', isSelected ? ['selected'] : [])}>
      {(node.type === BlueprintNodeType.Operation || node.type === BlueprintNodeType.Program) && (
        <OperationView
          nodeId={nodeId}
          contextProgramId={contextProgramId}
        />
      )}
      {node.type === BlueprintNodeType.Control && (
        <ControlView
          controlId={nodeId}
          contextProgramId={contextProgramId}
        />
      )}
    </div>
  )
}
