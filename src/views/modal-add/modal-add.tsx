
import './modal-add.scss'
import ModalView from 'views/modal/modal'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import { ModalState } from 'slices/ui/types'
import { addOperationAction } from 'slices/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasPosition } from 'slices/ui/selectors'
import { getOperations } from 'slices/directory/selectors'
import { popModalAction } from 'slices/ui'

export default function AddModalView(props: {
  modal: ModalState
}) {
  const dispatch = useAppDispatch()
  const activeProgram = useBlueprintSelector(state => getActiveProgram(state))
  const directoryOperations = useAppSelector(state => getOperations(state.directory))
  const canvasPosition = useAppSelector(state => getCanvasPosition(state.ui))

  return (
    <ModalView modal={props.modal} title="Add operation">
      <ul>
        {directoryOperations.map(operation => (
          <li key={operation.name}>
            <button
              onClick={() => {
                dispatch(addOperationAction({
                  programId: activeProgram!.id,
                  operation: operation,
                  x: canvasPosition.x,
                  y: canvasPosition.y,
                }))
                dispatch(popModalAction({}))
              }}
            >
              {operation.label}
            </button>
          </li>
        ))}
      </ul>
    </ModalView>
  )
}
