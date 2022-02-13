
import './app-header.scss'
import LogoView from 'views/logo/logo'
import ToolbarButtonView from 'views/toolbar-button/toolbar-button'
import ToolbarView from 'views/toolbar/toolbar'
import { ReactComponent as ArrowUpIcon } from 'icons/arrow-up.svg'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as RedoIcon } from 'icons/redo.svg'
import { ReactComponent as UndoIcon } from 'icons/undo.svg'
import { addEmptyProgramAction, leaveProgramAction, redoAction, undoAction } from 'slices/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { pushAddModalAction } from 'slices/ui'
import { useAppDispatch, useAppSelector, useBlueprintSelector } from '../../utils/hooks'
import { getCanvasPosition } from 'slices/ui/selectors'

export default function AppHeaderView() {
  const dispatch = useAppDispatch()
  const program = useBlueprintSelector(state => getActiveProgram(state))
  const canvasPosition = useAppSelector(state => getCanvasPosition(state.ui))

  // TODO: How to add a control?

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <LogoView />
        </div>
        <div className="app-header__toolbar">
          <ToolbarView items={[
            <ToolbarButtonView
              icon={<PlusIcon />}
              disabled={program === undefined}
              title="Add"
              onClick={() => dispatch(pushAddModalAction({}))}
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
            <ToolbarButtonView
              icon={<PlusIcon />}
              disabled={program === undefined}
              title="Add a program"
              onClick={() => dispatch(addEmptyProgramAction({
                programId: program!.id,
                x: canvasPosition.x,
                y: canvasPosition.y,
              }))}
            />,
          ]} />
        </div>
      </div>
    </header>
  )
}
