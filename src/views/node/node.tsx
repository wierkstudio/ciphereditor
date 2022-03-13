
import './node.scss'
import ControlView from 'views/control/control'
import OperationView from 'views/operation/operation'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { getNode, getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { useBlueprintSelector } from 'hooks/useBlueprintSelector'
import { useClassNames } from 'hooks/useClassNames'

export default function NodeView(props: {
  nodeId: BlueprintNodeId,
  contextProgramId: BlueprintNodeId,
}) {
  const { nodeId, contextProgramId } = props

  const node = useBlueprintSelector(state => getNode(state, nodeId))
  const selectedNode = useBlueprintSelector(getSelectedNode)

  const isSelected = node.id === selectedNode?.id

  return (
    <div className={useClassNames('node', isSelected ? ['selected'] : [])}>
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
