
import { getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { addEmptyControlAction, addEmptyProgramAction, leaveProgramAction, removeNodeAction } from '../../slices/blueprint'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'

function Bar() {
  const dispatch = useAppDispatch()
  const program = useAppSelector(state => getActiveProgram(state.blueprint))
  const selectedNode = useAppSelector(state => getSelectedNode(state.blueprint))

  return (
    <div className="bar">
      <button
        onClick={() => dispatch(leaveProgramAction({}))}
        disabled={!program || program.parentId === program.id}
      >Up</button>
      <button
        onClick={() => dispatch(addEmptyProgramAction({}))}
      >Add program</button>
      <button
        disabled={program === undefined}
        onClick={() => dispatch(addEmptyControlAction({ programId: program!.id }))}
      >Add control</button>
      <button
        disabled={selectedNode === undefined}
        onClick={() => dispatch(removeNodeAction({ nodeId: selectedNode!.id }))}
      >Remove selected</button>
    </div>
  )
}

export default Bar
