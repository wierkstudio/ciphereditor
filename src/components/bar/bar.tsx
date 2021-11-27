
import { getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { Operation } from 'types/operation'
import { addEmptyControlAction, addEmptyProgramAction, addOperationAction, leaveProgramAction, removeNodeAction } from '../../slices/blueprint'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'

const translateOperation: Operation = {
  name: 'cryptii/translate',
  label: 'Translate',
  controls: [
    {
      name: 'language1',
      initialValue: 'en',
      types: ['text'],
    },
    {
      // TODO: Limit length
      name: 'text1',
      initialValue: 'Hello, World.',
      types: ['text'],
      writable: false,
    },
    {
      name: 'language2',
      initialValue: 'de',
      types: ['text'],
    },
    {
      // TODO: Limit length
      name: 'text2',
      initialValue: 'Hallo Welt.',
      types: ['text'],
      writable: false,
    },
  ],
  bundleUrl: 'https://localhost:3000/bundle-essentials.js',
  moduleId: 'translate',
}

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
        disabled={program === undefined}
        onClick={() => dispatch(addOperationAction({
          programId: program!.id,
          operation: translateOperation,
        }))}
      >Add operation</button>
      <button
        disabled={selectedNode === undefined}
        onClick={() => dispatch(removeNodeAction({ nodeId: selectedNode!.id }))}
      >Remove selected</button>
    </div>
  )
}

export default Bar
