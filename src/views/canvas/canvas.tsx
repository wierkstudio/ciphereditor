
import './canvas.scss'
import MovableNodeView from 'views/movable-node/movable-node'
import WireDraftView from 'views/wire-draft/wire-draft'
import WireView from 'views/wire/wire'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useDragMove from 'hooks/useDragMove'
import useWindowResizeListener from 'hooks/useWindowResizeListener'
import { BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { PointerEvent, useCallback } from 'react'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasOffset, getWireDraft } from 'slices/ui/selectors'
import { getNodeChildren, getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { moveCanvasAction, updateCanvasSizeAction } from 'slices/ui'
import { selectNodeAction } from 'slices/blueprint'

export default function CanvasView (): JSX.Element {
  const dispatch = useAppDispatch()

  const hasSelectedNode = useBlueprintSelector(state => getSelectedNode(state) !== undefined)
  const contextProgramId = useBlueprintSelector(state => getActiveProgram(state)?.id)
  if (contextProgramId === undefined) {
    throw new Error('Assertion error: Active program needs to be set')
  }

  const variableIds = useBlueprintSelector(state =>
    getNodeChildren(state, contextProgramId)
      .filter(node => node.type === BlueprintNodeType.Variable)
      .map(node => node.id))

  const childNodeIds = useBlueprintSelector(state =>
    getNodeChildren(state, contextProgramId)
      .filter(node => node.type !== BlueprintNodeType.Variable)
      .map(node => node.id))

  const wireDraft = useAppSelector(state => getWireDraft(state.ui))
  const { x, y } = useAppSelector(state => getCanvasOffset(state.ui))

  // Keep track of the canvas size
  useWindowResizeListener((): void => {
    dispatch(updateCanvasSizeAction({
      width: window.innerWidth,
      height: window.innerHeight
    }))
  })

  // Move canvas interaction
  const onDragMove = (newX: number, newY: number): void => {
    dispatch(moveCanvasAction({ x: newX, y: newY }))
  }

  const { onPointerDown: onDragStart } = useDragMove(x, y, onDragMove, true)

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (hasSelectedNode) {
      dispatch(selectNodeAction({ nodeId: undefined }))
    }
    onDragStart(event)
  }, [hasSelectedNode, dispatch, onDragStart])

  // TODO: Make off-canvas nodes 'virtual' by not rendering them

  return (
    <div
      className='canvas'
      onPointerDown={onPointerDown}
    >
      <div
        className='canvas__content'
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
      {wireDraft !== undefined && (
        <div className='canvas__wire-draft'>
          <WireDraftView
            wireDraft={wireDraft}
            contextProgramId={contextProgramId}
          />
        </div>
      )}
    </div>
  )
}
