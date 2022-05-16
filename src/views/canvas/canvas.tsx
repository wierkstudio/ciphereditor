
import './canvas.scss'
import NodeView from 'views/node/node'
import WireDraftView from 'views/wire-draft/wire-draft'
import WireView from 'views/wire/wire'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useDragMove from 'hooks/useDragMove'
import useWindowResizeListener from 'hooks/useWindowResizeListener'
import { BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { FocusEvent } from 'react'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasOffset, getCanvasState, getWireDraft } from 'slices/ui/selectors'
import { getNodeChildren, getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { moveCanvasAction, updateCanvasSizeAction } from 'slices/ui'
import { renderClassName } from 'utils/dom'
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

  const canvasState = useAppSelector(state => getCanvasState(state.ui))
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

  const { onPointerDown } = useDragMove(x, y, onDragMove, true)

  const onFocus = (event: FocusEvent): void => {
    event.stopPropagation()
    if (hasSelectedNode) {
      dispatch(selectNodeAction({ nodeId: undefined }))
    }
  }

  // TODO: Make off-canvas nodes 'virtual' by not rendering them

  return (
    <div
      className={renderClassName('canvas', [canvasState])}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onFocus={onFocus}
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
          <NodeView
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
