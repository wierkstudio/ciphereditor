
import './movable-node.scss'
import NodeView from 'views/node/node'
import useAppDispatch from 'hooks/useAppDispatch'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import useDragMove, { gridSize } from 'hooks/useDragMove'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { getNodePosition, isSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { moveNodeAction } from 'slices/blueprint'

export default function MovableNodeView(props: {
  nodeId: BlueprintNodeId,
  contextProgramId: BlueprintNodeId,
}) {
  const { nodeId, contextProgramId } = props
  const { x, y } = useBlueprintSelector(state => getNodePosition(state, nodeId))
  const isSelected = useBlueprintSelector(state => isSelectedNode(state, nodeId))

  const dispatch = useAppDispatch()

  const onDragMove = (newX: number, newY: number) => {
    dispatch(moveNodeAction({ nodeId, x: newX, y: newY }))
  }

  const { onMouseDown } = useDragMove(x, y, onDragMove)

  return (
    <div
      className={useClassName('movable-node', isSelected ? ['selected'] : [])}
      onMouseDown={onMouseDown}
      style={{ transform: `translate(${x * gridSize}px, ${y * gridSize}px)` }}
    >
      <NodeView nodeId={nodeId} contextProgramId={contextProgramId} />
    </div>
  )
}
