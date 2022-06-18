
import './modal-add.scss'
import ButtonView from 'views/button/button'
import ModalView from 'views/modal/modal'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import { ModalState } from 'slices/ui/types'
import { addControlAction, addEmptyProgramAction, addOperationAction } from 'slices/blueprint'
import { capitalCase } from 'change-case'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasOffset, getCanvasSize } from 'slices/ui/selectors'
import { getContributions } from 'slices/directory/selectors'
import { gridSize } from 'hooks/useDragMove'
import { popModalAction } from 'slices/ui'

export default function AddModalView (props: {
  modal: ModalState
}): JSX.Element {
  const dispatch = useAppDispatch()
  const activeProgram = useBlueprintSelector(state => getActiveProgram(state))
  const contributions = useAppSelector(state => getContributions(state.directory))
  const canvasSize = useAppSelector(state => getCanvasSize(state.ui))
  const canvasOffset = useAppSelector(state => getCanvasOffset(state.ui))

  return (
    <ModalView modal={props.modal} title='Add a new operation'>
      <ul>
        {contributions.map(contribution => (
          <li key={contribution.name}>
            <ButtonView
              onClick={() => {
                // TODO: Remove magic numbers
                activeProgram !== undefined && dispatch(addOperationAction({
                  programId: activeProgram.id,
                  contribution,
                  x: Math.round((canvasOffset.x + canvasSize.width * 0.5 - 320 * 0.5) / gridSize) * gridSize,
                  y: Math.round((canvasOffset.y + canvasSize.height * 0.5 - 80) / gridSize) * gridSize
                }))
                dispatch(popModalAction({}))
              }}
            >
              {contribution.label ?? capitalCase(contribution.name)}
            </ButtonView>
          </li>
        ))}
        <li key='empty-operation'>
          <ButtonView
            onClick={() => {
              activeProgram !== undefined && dispatch(addEmptyProgramAction({
                programId: activeProgram.id,
                x: Math.round((canvasOffset.x + canvasSize.width * 0.5) / gridSize) * gridSize,
                y: Math.round((canvasOffset.y + canvasSize.height * 0.5) / gridSize) * gridSize
              }))
              dispatch(popModalAction({}))
            }}
          >
            New program
          </ButtonView>
        </li>
        <li key='empty-control'>
          <ButtonView
            onClick={() => {
              activeProgram !== undefined && dispatch(addControlAction({
                programId: activeProgram.id,
                x: Math.round((canvasOffset.x + canvasSize.width * 0.5 - 320 * 0.5) / gridSize) * gridSize,
                y: Math.round((canvasOffset.y + canvasSize.height * 0.5 - 64 * 0.5) / gridSize) * gridSize
              }))
              dispatch(popModalAction({}))
            }}
          >
            Empty control
          </ButtonView>
        </li>
      </ul>
    </ModalView>
  )
}
