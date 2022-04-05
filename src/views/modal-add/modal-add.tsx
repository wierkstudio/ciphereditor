
import './modal-add.scss'
import ModalView from 'views/modal/modal'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import { ModalState } from 'slices/ui/types'
import { addEmptyControlAction, addEmptyProgramAction, addOperationAction } from 'slices/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasPosition } from 'slices/ui/selectors'
import { getOperations } from 'slices/directory/selectors'
import { popModalAction } from 'slices/ui'
import ButtonView from 'views/button/button'

export default function AddModalView (props: {
  modal: ModalState
}): JSX.Element {
  const dispatch = useAppDispatch()
  const activeProgram = useBlueprintSelector(state => getActiveProgram(state))
  const directoryOperations = useAppSelector(state => getOperations(state.directory))
  const canvasPosition = useAppSelector(state => getCanvasPosition(state.ui))

  return (
    <ModalView modal={props.modal} title='Add node'>
      <ul>
        <li key='empty-operation'>
          <ButtonView
            onClick={() => {
              activeProgram !== undefined && dispatch(addEmptyProgramAction({
                programId: activeProgram.id,
                x: canvasPosition.x,
                y: canvasPosition.y
              }))
              dispatch(popModalAction({}))
            }}
          >
            Empty program
          </ButtonView>
        </li>
        <li key='empty-control'>
          <ButtonView
            onClick={() => {
              activeProgram !== undefined && dispatch(addEmptyControlAction({
                programId: activeProgram.id,
                x: canvasPosition.x - 320 * 0.5,
                y: canvasPosition.y - 64 * 0.5
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
                  x: canvasPosition.x - 320 * 0.5,
                  y: canvasPosition.y - 80
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
