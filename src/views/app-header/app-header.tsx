
import './app-header.scss'
import ToolbarButtonView from 'views/toolbar-button/toolbar-button'
import ToolbarView from 'views/toolbar/toolbar'
import { ReactComponent as ArrowUpIcon } from 'icons/arrow-up.svg'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as RedoIcon } from 'icons/redo.svg'
import { ReactComponent as UndoIcon } from 'icons/undo.svg'
import { addEmptyProgramAction, addOperationAction, leaveProgramAction, redoAction, undoAction } from 'slices/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getOperations } from 'slices/directory/selectors'
import { useAppDispatch, useAppSelector, useBlueprintSelector } from '../../utils/hooks'

export default function AppHeaderView() {
  const dispatch = useAppDispatch()
  const program = useBlueprintSelector(state => getActiveProgram(state))
  const directoryOperations = useAppSelector(state => getOperations(state.directory))

  // TODO: How to add a control?

  return (
    <header className="app-header">
      <div className="app-header__toolbar">
        <ToolbarView items={[
          <ToolbarButtonView
            icon={<PlusIcon />}
            disabled={program === undefined}
            onClick={() => dispatch(addEmptyProgramAction({ programId: program!.id }))}
          />,
          <ToolbarButtonView
            icon={<ArrowUpIcon />}
            onClick={() => dispatch(leaveProgramAction({}))}
            disabled={!program || program.parentId === program.id}
          />,
          [
            <ToolbarButtonView
            icon={<UndoIcon />}
              onClick={() => dispatch(undoAction())}
              disabled={useAppSelector(state => state.blueprint.past.length) === 0}
            />,
            <ToolbarButtonView
              icon={<RedoIcon />}
              onClick={() => dispatch(redoAction())}
              disabled={useAppSelector(state => state.blueprint.future.length) === 0}
            />,
          ],
          directoryOperations.map(operation => (
            <ToolbarButtonView
              icon={<PlusIcon />}
              disabled={program === undefined}
              title={operation.label}
              onClick={() => dispatch(addOperationAction({
                programId: program!.id,
                operation: operation,
              }))}
            />
          )),
        ]} />
      </div>
    </header>
  )
}
