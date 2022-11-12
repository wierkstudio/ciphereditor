
import './canvas.scss'
import IconView from '../../views/icon/icon'
import NodeView from '../../views/node/node'
import ScrollbarsView from '../scrollbars/scrollbars'
import WireDraftView from '../../views/wire-draft/wire-draft'
import WireView from '../../views/wire/wire'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useNormalizedWheel from '../../hooks/useNormalizedWheel'
import usePointerDrag from '../../hooks/usePointerDrag'
import useUISelector from '../../hooks/useUISelector'
import useWindowResizeListener from '../../hooks/useWindowResizeListener'
import { DragEvent, FocusEvent, useCallback, useRef } from 'react'
import { UICanvasState } from '../../slices/ui/types'
import { blueprintSchema } from '@ciphereditor/library'
import { getCanvasState, getWireDraft } from '../../slices/ui/selectors'
import { getContentBounds, getVisibleNodeIds, getVisibleVariableIds } from '../../slices/blueprint/selectors/program'
import { getHasSelection, getPlaneCanvas, getViewportRect } from '../../slices/blueprint/selectors/blueprint'
import { layoutCanvasAction, loadBlueprintAction, moveOffsetAction, selectAction } from '../../slices/blueprint'
import { renderClassName } from '../../lib/utils/dom'

export default function CanvasView (): JSX.Element {
  const dispatch = useAppDispatch()
  const canvasRef = useRef<HTMLDivElement | null>(null)

  const planeCanvas = useBlueprintSelector(getPlaneCanvas)
  const hasSelection = useBlueprintSelector(getHasSelection)

  const contentBounds = useBlueprintSelector(getContentBounds)

  const childNodeIds = useBlueprintSelector(getVisibleNodeIds)
  const variableIds = useBlueprintSelector(getVisibleVariableIds)

  const canvasState = useUISelector(getCanvasState)
  const wireDraft = useUISelector(getWireDraft)

  // Compose viewport rect
  const viewportRect = useBlueprintSelector(getViewportRect)

  // Keep track of the canvas size
  useWindowResizeListener((): void => {
    if (canvasRef.current !== null) {
      const clientRect = canvasRef.current.getBoundingClientRect()
      const size = { width: clientRect.width, height: clientRect.height }
      dispatch(layoutCanvasAction({ size }))
    }
  })

  // Move canvas interaction
  const onPointerDown = usePointerDrag((state, delta, event) => {
    if (state === 'move') {
      const deltaOffset = { x: -delta.x, y: -delta.y }
      dispatch(moveOffsetAction({ offset: deltaOffset, relative: true }))
    } else if (state === 'cancel' && hasSelection) {
      dispatch(selectAction({ nodeIds: [] }))
    }
  })

  useNormalizedWheel((event, wheelFacts) => {
    event.preventDefault()
    const deltaOffset = { x: wheelFacts.pixelX, y: wheelFacts.pixelY }
    dispatch(moveOffsetAction({ offset: deltaOffset, relative: true }))
  }, planeCanvas && canvasState === UICanvasState.Idle)

  const onScroll = (deltaX: number, deltaY: number): void => {
    const deltaOffset = { x: deltaX, y: deltaY }
    dispatch(moveOffsetAction({ offset: deltaOffset, relative: true }))
  }

  const onCanvasDrag = useCallback((event: DragEvent): void => {
    // TODO: Show visual clue that things can be dropped here
    // Prevent file from being opened by the browser
    event.preventDefault()
  }, [])

  const onCanvasDrop = useCallback((event: DragEvent): void => {
    // TODO: Decide wether a blueprint file is being dropped and if it is not,
    // add the content of the drop as a new control to the blueprint
    event.preventDefault()
    // Only consider the first item dragged on the canvas
    const item = Array.from(event.dataTransfer.items).at(0)
    if (item?.kind === 'file') {
      const file = item.getAsFile()
      if (file !== null) {
        void file.text().then((content: string): void => {
          const blueprint = blueprintSchema.parse(JSON.parse(content))
          dispatch(loadBlueprintAction({ blueprint }))
        })
      }
    }
  }, [])

  const onCanvasFocus = (event: FocusEvent): void => {
    event.stopPropagation()
    if (hasSelection) {
      dispatch(selectAction({ nodeIds: [] }))
    }
  }

  // TODO: Make off-canvas nodes 'virtual' by not rendering them

  return (
    <div
      ref={canvasRef}
      className={renderClassName('canvas', [canvasState])}
      tabIndex={0}
      onPointerDown={planeCanvas ? onPointerDown : undefined}
      onFocus={onCanvasFocus}
      onDragOver={onCanvasDrag}
      onDrop={onCanvasDrop}
    >
      <div
        className='canvas__content'
        onFocus={event => { event.stopPropagation() }}
        style={planeCanvas
          ? { transform: `translate(${-viewportRect.x}px, ${-viewportRect.y}px)` }
          : {}}
      >
        {planeCanvas && variableIds.map(variableId => (
          <WireView key={variableId} variableId={variableId} />
        ))}
        {childNodeIds.map(nodeId => (
          <NodeView key={nodeId} nodeId={nodeId} />
        ))}
      </div>
      {wireDraft !== undefined && (
        <div className='canvas__wire-draft'>
          <WireDraftView wireDraft={wireDraft} />
        </div>
      )}
      {planeCanvas && contentBounds !== undefined && (
        <div className='canvas__scrollbars'>
          <ScrollbarsView
            viewportRect={viewportRect}
            contentRect={contentBounds}
            onScroll={onScroll}
          />
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
