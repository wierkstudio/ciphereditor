
import './canvas.scss'
import MovableNodeView from 'views/movable-node/movable-node'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useDragMove from 'hooks/useDragMove'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { DragEvent, useCallback } from 'react'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasPosition } from 'slices/ui/selectors'
import { getNodeChildren, getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { moveCanvasAction } from 'slices/ui'
import { selectNodeAction } from 'slices/blueprint'
import WireView from 'views/wire/wire'

export default function CanvasView() {
  const dispatch = useAppDispatch()

  const hasSelectedNode = useBlueprintSelector(state => getSelectedNode(state) !== undefined)
  const contextProgramId = useBlueprintSelector(state => getActiveProgram(state)!.id)
  const variableIds = useBlueprintSelector(state =>
    getNodeChildren(state, contextProgramId)
      .filter(node => node.type === BlueprintNodeType.Variable)
      .map(node => node.id) as BlueprintNodeId[])
  const childNodeIds = useBlueprintSelector(state =>
    getNodeChildren(state, contextProgramId)
      .filter(node => node.type !== BlueprintNodeType.Variable)
      .map(node => node.id) as BlueprintNodeId[])

  const { x, y } = useAppSelector(state => getCanvasPosition(state.ui))

  const onDragMove = (newX: number, newY: number) => {
    dispatch(moveCanvasAction({ x: newX, y: newY }))
  }

  const { onMouseDown: onDragMouseDown } = useDragMove(x, y, onDragMove, true)

  const onMouseDown = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (hasSelectedNode) {
      dispatch(selectNodeAction({ nodeId: undefined }))
    }
    onDragMouseDown(event)
  }, [hasSelectedNode, dispatch, onDragMouseDown])

  // TODO: Make off-canvas nodes 'virtual' by not rendering them

  return (
    <div
      className="canvas"
      onMouseDown={onMouseDown}
    >
      <div
        className="canvas__content"
        style={{ transform: `translate(${-x}px, ${-y}px)` }}
      >
        {variableIds.map(variableId => (
          <WireView
            key={variableId}
            variableId={variableId}
          />
        ))}
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
