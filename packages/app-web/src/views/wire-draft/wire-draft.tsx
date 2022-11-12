
import './wire-draft.scss'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useCallbackRef from '../../hooks/useCallbackRef'
import usePointerFollowUp from '../../hooks/usePointerFollowUp'
import { Point } from '@ciphereditor/library'
import { UIWireDraft } from '../../slices/ui/types'
import { attachControlsAction } from '../../slices/blueprint'
import { endWireAction } from '../../slices/ui'
import { getControlNode, getOutletPosition } from '../../slices/blueprint/selectors/control'
import { getViewportRect } from '../../slices/blueprint/selectors/blueprint'
import { useRef, useState } from 'react'

export default function WireDraftView (props: {
  wireDraft: UIWireDraft
}): JSX.Element {
  const wireDraft = props.wireDraft
  const wireDraftRef = useRef<SVGSVGElement | null>(null)

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
    useState<Point | undefined>(undefined)

  const onWireMove = useCallbackRef((event: PointerEvent) => {
    if (wireDraftRef.current !== null) {
      const clientRect = wireDraftRef.current.getBoundingClientRect()
      const point = {
        x: event.clientX - clientRect.x,
        y: event.clientY - clientRect.y
      }
      setTargetPosition(point)
    }
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
      ref={wireDraftRef}
      className='wire-draft'
      width='100%'
      height='100%'
    >
      <path d={pathD} />
    </svg>
  )
}
