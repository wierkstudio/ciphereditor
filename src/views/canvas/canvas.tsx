
import './canvas.scss'
import MovableNodeView from 'views/movable-node/movable-node'
import useDragMove, { gridSize } from 'hooks/useDragMove'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasPosition } from 'slices/ui/selectors'
import { getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { moveCanvasAction } from 'slices/ui'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { useAppSelector } from 'hooks/useAppSelector'
import { useBlueprintSelector } from 'hooks/useBlueprintSelector'

export default function CanvasView() {
  const dispatch = useAppDispatch()

  const contextProgramId = useBlueprintSelector(state => getActiveProgram(state)!.id)
  const childNodeIds = useBlueprintSelector(state =>
    getNodeChildren(state, contextProgramId)
      .filter(node => node.type !== BlueprintNodeType.Variable)
      .map(node => node.id) as BlueprintNodeId[])

  const { x, y } = useAppSelector(state => getCanvasPosition(state.ui))

  const onDragMove = (newX: number, newY: number) => {
    dispatch(moveCanvasAction({ x: newX, y: newY }))
  }

  const { onMouseDown } = useDragMove(x, y, onDragMove, true)

  // TODO: Make off-canvas nodes 'virtual' by not rendering them

  return (
    <div
      className="canvas"
      onMouseDown={onMouseDown}
    >
      <div
        className="canvas__content"
        style={{ transform: `translate(${-x * gridSize}px, ${-y * gridSize}px)` }}
      >
        {childNodeIds.map(nodeId => (
          <MovableNodeView
            key={nodeId}
            nodeId={nodeId}
            contextProgramId={contextProgramId}
          />
        ))}
      </div>
    </div>
  )
}
