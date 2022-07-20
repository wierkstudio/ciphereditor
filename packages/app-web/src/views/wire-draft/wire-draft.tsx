
import './wire-draft.scss'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useCallbackRef from '../../hooks/useCallbackRef'
import usePointerFollowUp from '../../hooks/usePointerFollowUp'
import useUISelector from '../../hooks/useUISelector'
import { BlueprintNodeId } from '../../slices/blueprint/types/blueprint'
import { UIWireDraft } from '../../slices/ui/types'
import { attachControlsAction } from '../../slices/blueprint'
import { endWireAction } from '../../slices/ui'
import { getCanvasMode, getCanvasOffset } from '../../slices/ui/selectors'
import { getOutletPosition } from '../../slices/blueprint/selectors/control'
import { useState } from 'react'

export default function WireDraftView (props: {
  wireDraft: UIWireDraft
  contextProgramId: BlueprintNodeId
}): JSX.Element {
  const { wireDraft, contextProgramId } = props

  const dispatch = useAppDispatch()

  // TODO: Handle source control node deletion while wiring
  const canvasMode = useUISelector(getCanvasMode)
  const sourcePosition = useBlueprintSelector(state => getOutletPosition(
    state,
    wireDraft.sourceControlId,
    contextProgramId,
    canvasMode
  ))
  const canvasOffset = useUISelector(getCanvasOffset)
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
    }
    dispatch(endWireAction({}))
  }, [dispatch, wireDraft, contextProgramId])

  usePointerFollowUp(onWireMove, onWireEnd)

  // Draw path
  let pathD = ''
  if (sourcePosition !== undefined && targetPosition !== undefined) {
    pathD =
      `M ${sourcePosition.x - canvasOffset.x},${sourcePosition.y - canvasOffset.y} ` +
      `L ${targetPosition.x},${targetPosition.y} `
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
