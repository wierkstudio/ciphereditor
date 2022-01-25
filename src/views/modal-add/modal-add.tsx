
import './modal-add.scss'
import { ModalState } from 'slices/ui/types'
import { addOperationAction } from 'slices/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getOperations } from 'slices/directory/selectors'
import { popModalAction } from 'slices/ui'
import { useAppDispatch, useAppSelector, useBlueprintSelector } from 'utils/hooks'
import ModalView from 'views/modal/modal'

export default function AddModalView(props: {
  modal: ModalState
}) {
  const dispatch = useAppDispatch()
  const activeProgram = useBlueprintSelector(state => getActiveProgram(state))
  const directoryOperations = useAppSelector(state => getOperations(state.directory))
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
