
import './wire-draft.scss'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useCallbackRef from 'hooks/useCallbackRef'
import usePointerFollowUp from 'hooks/usePointerFollowUp'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { UIWireDraft } from 'slices/ui/types'
import { addControlAction, attachControlsAction } from 'slices/blueprint'
import { endWireAction } from 'slices/ui'
import { getCanvasOffset } from 'slices/ui/selectors'
import { getOutletPosition } from 'slices/blueprint/selectors/control'
import { useState } from 'react'
import { gridSize } from 'hooks/useDragMove'

export default function WireDraftView (props: {
  wireDraft: UIWireDraft
  contextProgramId: BlueprintNodeId
}): JSX.Element {
  const { wireDraft, contextProgramId } = props

  const dispatch = useAppDispatch()

  // TODO: Handle source control node deletion while wiring
  const sourcePosition = useBlueprintSelector(state =>
    getOutletPosition(state, wireDraft.sourceControlId, contextProgramId))
  const canvasOffset = useAppSelector(state => getCanvasOffset(state.ui))
  const [targetPosition, setTargetPosition] =
    useState<{ x: number, y: number } | undefined>(undefined)

  const onWireMove = useCallbackRef((event: PointerEvent) => {
    setTargetPosition({ x: event.clientX, y: event.clientY })
  }, [setTargetPosition])

  const onWireEnd = useCallbackRef((event: PointerEvent) => {
    if (wireDraft.targetControlId !== undefined) {
      // Attach source control to target control
      dispatch(attachControlsAction({
        sourceControlId: wireDraft.sourceControlId,
        targetControlId: wireDraft.targetControlId,
        contextProgramId
      }))
    } else if (targetPosition !== undefined) {
      // Create a new control at the target position and attach the source
      // control to it

      // Determine the location where the new control should be placed
      // Default: Place center, center of the control below the pointer
      let relX = - 320 * 0.5
      let relY = - 24

      if (
        sourcePosition !== undefined &&
        Math.abs(sourcePosition.y - targetPosition.y) <
          Math.abs(sourcePosition.x - targetPosition.x)
      ) {
        relX =
          sourcePosition.x - targetPosition.x > 0
            // Place center, right of the control below the pointer
            ? - 320 + 24
            // Place center, left of the control below the pointer
            : - 24
      }

      dispatch(addControlAction({
        programId: contextProgramId,
        x: Math.round((targetPosition.x + canvasOffset.x + relX) / gridSize) * gridSize,
        y: Math.round((targetPosition.y + canvasOffset.y + relY) / gridSize) * gridSize,
        sourceControlId: wireDraft.sourceControlId
      }))
    }
    dispatch(endWireAction({}))
  }, [dispatch, wireDraft, canvasOffset, sourcePosition, targetPosition, contextProgramId])

  usePointerFollowUp(onWireMove, onWireEnd)

  // Draw path
  let pathD = ''
  if (sourcePosition !== undefined) {
    pathD =
      `M ${sourcePosition.x - canvasOffset.x},${sourcePosition.y - canvasOffset.y} ` +
      `L ${targetPosition?.x},${targetPosition?.y} `
  }

  // TODO: Draw arrow cap

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
