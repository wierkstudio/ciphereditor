
import './wire-draft.scss'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useCallbackRef from '../../hooks/useCallbackRef'
import usePointerFollowUp from '../../hooks/usePointerFollowUp'
import { UIWireDraft } from '../../slices/ui/types'
import { attachControlsAction } from '../../slices/blueprint'
import { endWireAction } from '../../slices/ui'
import { getControlNode, getOutletPosition } from '../../slices/blueprint/selectors/control'
import { getViewportRect } from '../../slices/blueprint/selectors/blueprint'
import { useState } from 'react'

export default function WireDraftView (props: {
  wireDraft: UIWireDraft
}): JSX.Element {
  const wireDraft = props.wireDraft

  const dispatch = useAppDispatch()

  // TODO: Handle source control node deletion while wiring
  const activeProgramId = useBlueprintSelector(state => state.activeProgramId)

  const sourceControl = useBlueprintSelector(state =>
    getControlNode(state, wireDraft.sourceControlId))
  const outward = sourceControl.parentId !== activeProgramId

  const sourcePosition = useBlueprintSelector(state =>
    getOutletPosition(state, sourceControl.id, outward))
  const viewportRect = useBlueprintSelector(getViewportRect)

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
        outward
      }))
    }
    dispatch(endWireAction({}))
  }, [dispatch, wireDraft, outward])

  usePointerFollowUp(onWireMove, onWireEnd)

  // Draw path
  let pathD = ''
  if (sourcePosition !== undefined && targetPosition !== undefined) {
    pathD =
      `M ${sourcePosition.x - viewportRect.x},${sourcePosition.y - viewportRect.y} ` +
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
