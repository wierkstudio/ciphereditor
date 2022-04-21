
import './wire-draft.scss'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { UIWireDraft } from 'slices/ui/types'
import { attachControlsAction } from 'slices/blueprint'
import { endWireAction, moveWireAction } from 'slices/ui'
import { getCanvasOffset } from 'slices/ui/selectors'
import { getNode } from 'slices/blueprint/selectors/blueprint'
import { getOutletPosition } from 'slices/blueprint/selectors/control'
import { passiveListenerOptions } from 'utils/dom'
import { useEffect, useRef } from 'react'

export default function WireDraftView (props: {
  wireDraft: UIWireDraft
  contextProgramId: BlueprintNodeId
}): JSX.Element {
  const { wireDraft, contextProgramId } = props

  const dispatch = useAppDispatch()

  // TODO: Handle source control node deletion while wiring
  const sourceControl = useBlueprintSelector(state => getNode(state, wireDraft.sourceControlId))
  const sourceOutletPosition = useBlueprintSelector(state => getOutletPosition(state, sourceControl.id, contextProgramId))
  const canvasOffset = useAppSelector(state => getCanvasOffset(state.ui))

  const onWireEndRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    onWireEndRef.current = (): void => {
      const { sourceControlId, targetControlId } = wireDraft
      if (targetControlId !== undefined) {
        dispatch(attachControlsAction({
          sourceControlId,
          targetControlId,
          contextProgramId
        }))
      }
      dispatch(endWireAction({}))
    }
  }, [onWireEndRef, dispatch, wireDraft, contextProgramId])

  // Listen to pointer events relevant to wiring
  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      dispatch(moveWireAction({ x: event.clientX, y: event.clientY }))
    }
    const onPointerEnd = (event: PointerEvent): void => {
      if (onWireEndRef.current !== null) {
        onWireEndRef.current()
      }
    }
    window.addEventListener('pointermove', onPointerMove, passiveListenerOptions)
    window.addEventListener('pointerup', onPointerEnd)
    window.addEventListener('pointercancel', onPointerEnd)
    return () => {
      window.removeEventListener('pointermove', onPointerMove, passiveListenerOptions)
      window.removeEventListener('pointerup', onPointerEnd)
      window.removeEventListener('pointercancel', onPointerEnd)
    }
  }, [onWireEndRef, dispatch])

  // Draw path
  let pathD = ''
  if (sourceOutletPosition !== undefined && wireDraft.targetViewportPosition !== undefined) {
    pathD =
      `M ${sourceOutletPosition.x - canvasOffset.x},${sourceOutletPosition.y - canvasOffset.y} ` +
      `L ${wireDraft.targetViewportPosition.x},${wireDraft.targetViewportPosition.y} `
  }

  return (
    <svg
      className='wire-draft'
      width='100%'
      height='100%'
    >
      <path d={pathD} />
    </svg>
  )
}
