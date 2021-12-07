
import { getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getOperations } from 'slices/directory/selectors'
import { BlueprintNodeType } from 'types/blueprint'
import { addEmptyControlAction, addEmptyProgramAction, addOperationAction, leaveProgramAction, linkControlAction, removeNodeAction } from '../../slices/blueprint'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'
import './bar.scss'

export default function BarView() {
  const dispatch = useAppDispatch()
  const program = useAppSelector(state => getActiveProgram(state.blueprint))
  const selectedNode = useAppSelector(state => getSelectedNode(state.blueprint))
  const directoryOperations = useAppSelector(state => getOperations(state.directory))

  return (
    <div className="bar">
      <button
        onClick={() => dispatch(leaveProgramAction({}))}
        disabled={!program || program.parentId === program.id}
      >Up</button>
      <button
        disabled={selectedNode === undefined}
        onClick={() => dispatch(removeNodeAction({}))}
      >Remove</button>
      <button
        disabled={selectedNode === undefined || selectedNode.type !== BlueprintNodeType.Control}
        onClick={() => dispatch(linkControlAction({ controlId: selectedNode!.id }))}
      >Link</button>
      <button
        onClick={() => dispatch(addEmptyProgramAction({}))}
      >Add program</button>
      <button
        disabled={program === undefined}
        onClick={() => dispatch(addEmptyControlAction({ programId: program!.id }))}
      >Add control</button>
      {directoryOperations.map(operation => (
        <button
          key={operation.name}
          disabled={program === undefined}
          onClick={() => dispatch(addOperationAction({
            programId: program!.id,
            operation: operation,
          }))}
        >Add {operation.label}</button>
      ))}
    </div>
  )
}
