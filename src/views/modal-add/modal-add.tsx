
import './modal-add.scss'
import ButtonView from 'views/button/button'
import ModalView from 'views/modal/modal'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import { ModalState } from 'slices/ui/types'
import { addControlAction, addEmptyProgramAction, addOperationAction } from 'slices/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasOffset, getCanvasSize } from 'slices/ui/selectors'
import { getOperations } from 'slices/directory/selectors'
import { gridSize } from 'hooks/useDragMove'
import { popModalAction } from 'slices/ui'

export default function AddModalView (props: {
  modal: ModalState
}): JSX.Element {
  const dispatch = useAppDispatch()
  const activeProgram = useBlueprintSelector(state => getActiveProgram(state))
  const directoryOperations = useAppSelector(state => getOperations(state.directory))
  const canvasSize = useAppSelector(state => getCanvasSize(state.ui))
  const canvasOffset = useAppSelector(state => getCanvasOffset(state.ui))

  return (
    <ModalView modal={props.modal} title='Operation directory'>
      <ul>
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
            Control
          </ButtonView>
        </li>
        {directoryOperations.map(operation => (
          <li key={operation.name}>
            <ButtonView
              onClick={() => {
                // TODO: Remove magic numbers
                activeProgram !== undefined && dispatch(addOperationAction({
                  programId: activeProgram.id,
                  operation: operation,
                  x: Math.round((canvasOffset.x + canvasSize.width * 0.5 - 320 * 0.5) / gridSize) * gridSize,
                  y: Math.round((canvasOffset.y + canvasSize.height * 0.5 - 80) / gridSize) * gridSize
                }))
                dispatch(popModalAction({}))
              }}
            >
              {operation.label}
            </ButtonView>
          </li>
        ))}
      </ul>
    </ModalView>
  )
}
