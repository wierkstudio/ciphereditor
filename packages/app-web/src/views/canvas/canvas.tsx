
import './canvas.scss'
import IconView from '../../views/icon/icon'
import NodeView from '../../views/node/node'
import WireDraftView from '../../views/wire-draft/wire-draft'
import WireView from '../../views/wire/wire'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useNormalizedWheel from '../../hooks/useNormalizedWheel'
import usePointerDrag from '../../hooks/usePointerDrag'
import useUISelector from '../../hooks/useUISelector'
import useWindowResizeListener from '../../hooks/useWindowResizeListener'
import { BlueprintNodeType } from '../../slices/blueprint/types/blueprint'
import { FocusEvent } from 'react'
import { ProgramNode } from '../../slices/blueprint/types/program'
import { UICanvasMode, UICanvasState } from '../../slices/ui/types'
import { getActiveProgram } from '../../slices/blueprint/selectors/program'
import { getCanvasMode, getCanvasState, getViewportRect, getWireDraft } from '../../slices/ui/selectors'
import { getNode, getNodeChildren, getSelectedNode } from '../../slices/blueprint/selectors/blueprint'
import { layoutScrollbars, ScrollbarsLayout } from '../../lib/utils/2d'
import { moveCanvasAction, updateCanvasSizeAction } from '../../slices/ui'
import { renderClassName } from '../../lib/utils/dom'
import { selectNodeAction } from '../../slices/blueprint'

const scrollbarOffset = 8
const scrollbarSize = 8

export default function CanvasView (): JSX.Element {
  const dispatch = useAppDispatch()

  const canvasMode = useUISelector(getCanvasMode)
  const hasSelectedNode = useBlueprintSelector(state => getSelectedNode(state) !== undefined)
  const contextProgramId = useBlueprintSelector(state => getActiveProgram(state)?.id)
  if (contextProgramId === undefined) {
    throw new Error('Assertion error: Active program needs to be set')
  }

  const program =
    useBlueprintSelector(state =>
      getNode(state, contextProgramId)) as ProgramNode

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
  const viewportRect = useAppSelector(state => getViewportRect(state.ui))

  // Keep track of the canvas size
  useWindowResizeListener((): void => {
    dispatch(updateCanvasSizeAction({
      width: window.innerWidth,
      height: window.innerHeight
    }))
  })

  // Move canvas interaction
  const onDragMove = (deltaX: number, deltaY: number): void => {
    dispatch(moveCanvasAction({ x: deltaX, y: deltaY, relative: true }))
  }

  const onPointerDown = usePointerDrag(onDragMove, true)

  useNormalizedWheel((event, wheelFacts) => {
    event.preventDefault()
    dispatch(moveCanvasAction({
      x: wheelFacts.pixelX * 2,
      y: wheelFacts.pixelY * 2,
      relative: true
    }))
  }, canvasMode === UICanvasMode.Plane && canvasState === UICanvasState.Idle)

  /**
   * Handle blur events emitted by child nodes.
   */
  const onBlur = (event: FocusEvent): void => {
    event.stopPropagation()
    if (hasSelectedNode) {
      dispatch(selectNodeAction({ nodeId: undefined }))
    }
  }

  const onCanvasFocus = (event: FocusEvent): void => {
    event.stopPropagation()
    if (hasSelectedNode) {
      dispatch(selectNodeAction({ nodeId: undefined }))
    }
  }

  let scrollbarLayout: ScrollbarsLayout | undefined
  if (canvasMode === UICanvasMode.Plane) {
    scrollbarLayout = layoutScrollbars(viewportRect, program.contentBounds)
  }

  // TODO: Make off-canvas nodes 'virtual' by not rendering them

  return (
    <div
      className={renderClassName('canvas', [canvasState])}
      tabIndex={0}
      onPointerDown={canvasMode === UICanvasMode.Plane ? onPointerDown : undefined}
      onFocus={onCanvasFocus}
    >
      <div
        className='canvas__content'
        onFocus={event => { event.stopPropagation() }}
        onBlur={onBlur}
        style={canvasMode === UICanvasMode.Plane
          ? { transform: `translate(${-viewportRect.x}px, ${-viewportRect.y}px)` }
          : {}}
      >
        {canvasMode === UICanvasMode.Plane && variableIds.map(variableId => (
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
      {scrollbarLayout !== undefined && (
        <div className='canvas__scrollbars'>
          <svg
            className='canvas__scrollbars-svg'
            preserveAspectRatio='xMidYMid meet'
            viewBox={`0 0 ${viewportRect.width} ${viewportRect.height}`}
          >
            {scrollbarLayout.verticalSize < 1 && (
              <rect
                className='canvas__scrollbars-vertical'
                x={viewportRect.width - scrollbarSize - scrollbarOffset}
                y={
                  scrollbarOffset +
                  scrollbarLayout.verticalPosition *
                  (1 - scrollbarLayout.verticalSize) *
                  (viewportRect.height - scrollbarOffset * 3 - scrollbarSize)
                }
                rx={scrollbarSize * 0.5}
                ry={scrollbarSize * 0.5}
                width={scrollbarSize}
                height={
                  (viewportRect.height - scrollbarOffset * 3 - scrollbarSize) *
                  scrollbarLayout.verticalSize
                }
              />
            )}
            {scrollbarLayout.horizontalSize < 1 && (
              <rect
                className='canvas__scrollbars-horizontal'
                x={
                  scrollbarOffset +
                  scrollbarLayout.horizontalPosition *
                  (1 - scrollbarLayout.horizontalSize) *
                  (viewportRect.width - scrollbarOffset * 3 - scrollbarSize)
                }
                y={viewportRect.height - scrollbarSize - scrollbarOffset}
                rx={scrollbarSize * 0.5}
                ry={scrollbarSize * 0.5}
                width={
                  (viewportRect.width - scrollbarOffset * 3 - scrollbarSize) *
                  scrollbarLayout.horizontalSize
                }
                height={scrollbarSize}
              />
            )}
          </svg>
        </div>
      )}
      {childNodeIds.length === 0 && (
        <div className='canvas__empty'>
          <p className='canvas__empty-message'>
            {/* TODO: Needs translation */}
            Press <IconView icon='plus' modifiers='inline-reference' /> to
            explore operations and start building your own workflow.
          </p>
        </div>
      )}
    </div>
  )
}
