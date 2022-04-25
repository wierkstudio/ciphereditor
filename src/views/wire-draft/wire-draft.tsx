
import './wire-draft.scss'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useCallbackRef from 'hooks/useCallbackRef'
import usePointerFollowUp from 'hooks/usePointerFollowUp'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { UIWireDraft } from 'slices/ui/types'
import { attachControlsAction } from 'slices/blueprint'
import { endWireAction, moveWireAction } from 'slices/ui'
import { getCanvasOffset } from 'slices/ui/selectors'
import { getOutletPosition } from 'slices/blueprint/selectors/control'

export default function WireDraftView (props: {
  wireDraft: UIWireDraft
  contextProgramId: BlueprintNodeId
}): JSX.Element {
  const { wireDraft, contextProgramId } = props
  const { sourceControlId, targetControlId } = wireDraft

  const dispatch = useAppDispatch()

  // TODO: Handle source control node deletion while wiring
  const sourceOutletPosition = useBlueprintSelector(state =>
    getOutletPosition(state, sourceControlId, contextProgramId))
  const canvasOffset = useAppSelector(state => getCanvasOffset(state.ui))

  const onWireMove = useCallbackRef((event: PointerEvent) => {
    dispatch(moveWireAction({ x: event.clientX, y: event.clientY }))
  }, [dispatch])

  const onWireEnd = useCallbackRef((event: PointerEvent) => {
    if (targetControlId !== undefined) {
      dispatch(attachControlsAction({
        sourceControlId,
        targetControlId,
        contextProgramId
      }))
    }
    dispatch(endWireAction({}))
  }, [dispatch, sourceControlId, targetControlId, contextProgramId])

  usePointerFollowUp(onWireMove, onWireEnd)

  // Draw path
  let pathD = ''
  if (sourceOutletPosition !== undefined && wireDraft.targetViewportPosition !== undefined) {
    pathD =
      `M ${sourceOutletPosition.x - canvasOffset.x},${sourceOutletPosition.y - canvasOffset.y} ` +
      `L ${wireDraft.targetViewportPosition.x},${wireDraft.targetViewportPosition.y} `
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
