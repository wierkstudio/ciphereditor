
import './scrollbars.scss'
import usePointerDrag, { PointerDragState } from '../../hooks/usePointerDrag'
import { Rect } from '@ciphereditor/library'
import { layoutScrollbars, ScrollbarsLayout } from '../../lib/utils/2d'
import { useCallback, useState } from 'react'

// Magic numbers inspired by macOS scrollbars
const scrollbarOffset = 2
const scrollbarSize = 7

export default function ScrollbarsView (props: {
  viewportRect: Rect
  contentRect: Rect
  onScroll: (deltaX: number, deltaY: number) => void
}): JSX.Element {
  const { viewportRect, contentRect, onScroll } = props
  const viewportLayout = layoutScrollbars(viewportRect, contentRect)

  const [draggingLayout, setDraggingLayout] =
    useState<ScrollbarsLayout | undefined>(undefined)

  // TODO: Why is this off by one?
  const verticalTrackHeight = viewportRect.height - scrollbarOffset * 3 - scrollbarSize - 1
  const horizontalTrackWidth = viewportRect.width - scrollbarOffset * 3 - scrollbarSize

  const onPointerDrag = useCallback((
    horizontal: boolean,
    state: PointerDragState,
    deltaX: number,
    deltaY: number
  ): void => {
    switch (state) {
      case 'pointerdown':
        setDraggingLayout(viewportLayout)
        break
      case 'pointermove':
        if (draggingLayout !== undefined) {
          if (horizontal) {
            const positionScope = (1 - draggingLayout.horizontalSize) * horizontalTrackWidth
            const position = Math.max(Math.min(deltaX / positionScope + draggingLayout.horizontalPosition, 1), 0)
            const scrollDelta = (position - draggingLayout.horizontalPosition) * draggingLayout.horizontalScope
            onScroll(scrollDelta, 0)
            setDraggingLayout({ ...draggingLayout, horizontalPosition: position })
          } else {
            const positionScope = (1 - draggingLayout.verticalSize) * verticalTrackHeight
            const position = Math.max(Math.min(deltaY / positionScope + draggingLayout.verticalPosition, 1), 0)
            const scrollDelta = (position - draggingLayout.verticalPosition) * draggingLayout.verticalScope
            onScroll(0, scrollDelta)
            setDraggingLayout({ ...draggingLayout, verticalPosition: position })
          }
        }
        break
      case 'pointerup':
        setDraggingLayout(undefined)
        break
    }
  }, [viewportLayout, draggingLayout, setDraggingLayout, onScroll, verticalTrackHeight, horizontalTrackWidth])

  const onHorizontalKnobPointerDown = usePointerDrag(onPointerDrag.bind(null, true))
  const onVerticalKnobPointerDown = usePointerDrag(onPointerDrag.bind(null, false))

  const layout = draggingLayout ?? viewportLayout

  return (
    <svg
      className='scrollbars'
      preserveAspectRatio='xMidYMid meet'
      viewBox={`0 0 ${viewportRect.width} ${viewportRect.height}`}
    >
      {layout.verticalSize < 1 && (
        <rect
          className='scrollbars__knob-vertical'
          x={viewportRect.width - scrollbarSize - scrollbarOffset}
          y={
            scrollbarOffset +
            layout.verticalPosition *
            (1 - layout.verticalSize) *
            verticalTrackHeight
          }
          rx={scrollbarSize * 0.5}
          ry={scrollbarSize * 0.5}
          width={scrollbarSize}
          height={verticalTrackHeight * layout.verticalSize}
          onPointerDown={onVerticalKnobPointerDown}
        />
      )}
      {layout.horizontalSize < 1 && (
        <rect
          className='scrollbars__knob-horizontal'
          x={
            scrollbarOffset +
            layout.horizontalPosition *
            (1 - layout.horizontalSize) *
            horizontalTrackWidth
          }
          // TODO: Why is this off by one?
          y={viewportRect.height - scrollbarSize - scrollbarOffset - 1}
          rx={scrollbarSize * 0.5}
          ry={scrollbarSize * 0.5}
          width={horizontalTrackWidth * layout.horizontalSize}
          height={scrollbarSize}
          onPointerDown={onHorizontalKnobPointerDown}
        />
      )}
    </svg>
  )
}
