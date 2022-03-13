
import './app-header.scss'
import IconView from 'views/icon/icon'
import LogoView from 'views/logo/logo'
import ToolbarButtonView from 'views/toolbar-button/toolbar-button'
import ToolbarView from 'views/toolbar/toolbar'
import { addEmptyProgramAction, leaveProgramAction, redoAction, undoAction } from 'slices/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasPosition } from 'slices/ui/selectors'
import { pushAddModalAction } from 'slices/ui'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { useAppSelector } from 'hooks/useAppSelector'
import { useBlueprintSelector } from 'hooks/useBlueprintSelector'

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
              icon={<IconView icon="plus" />}
              disabled={program === undefined}
              title="Add"
              onClick={() => dispatch(pushAddModalAction({}))}
            />,
            <ToolbarButtonView
              icon={<IconView icon="arrowUp" />}
              onClick={() => dispatch(leaveProgramAction({}))}
              disabled={!program || program.parentId === program.id}
            />,
            [
              <ToolbarButtonView
              icon={<IconView icon="undo" />}
                onClick={() => dispatch(undoAction())}
                disabled={useAppSelector(state => state.blueprint.past.length) === 0}
              />,
              <ToolbarButtonView
                icon={<IconView icon="redo" />}
                onClick={() => dispatch(redoAction())}
                disabled={useAppSelector(state => state.blueprint.future.length) === 0}
              />,
            ],
            <ToolbarButtonView
              icon={<IconView icon="plus" />}
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
