
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { addEmptyProgram, leaveProgram } from '../../slices/blueprint'
import { useAppDispatch, useAppSelector } from '../../utils/hooks'

function Bar() {
  const dispatch = useAppDispatch()
  const activeProgram = useAppSelector(state => getActiveProgram(state.blueprint))

  return (
    <div className="bar">
      <button
        onClick={() => dispatch(leaveProgram({}))}
        disabled={!activeProgram || activeProgram.parentId === activeProgram.id}
      >Up</button>
      <button
        onClick={() => dispatch(addEmptyProgram({}))}
      >Add program</button>
    </div>
  )
}

export default Bar
