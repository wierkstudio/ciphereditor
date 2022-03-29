
import './app-header.scss'
import ButtonView from 'views/button/button'
import LogoView from 'views/logo/logo'
import ToolbarView from 'views/toolbar/toolbar'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import { addEmptyControlAction, addEmptyProgramAction, leaveProgramAction, redoAction, undoAction } from 'slices/blueprint'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getCanvasPosition } from 'slices/ui/selectors'
import { pushAddModalAction } from 'slices/ui'

export default function AppHeaderView (): JSX.Element {
  const dispatch = useAppDispatch()
  const program = useBlueprintSelector(state => getActiveProgram(state))
  const canvasPosition = useAppSelector(state => getCanvasPosition(state.ui))

  // TODO: How to add a control?

  return (
    <header className='app-header'>
      <div className='app-header__inner'>
        <div className='app-header__brand'>
          <LogoView />
        </div>
        <div className='app-header__toolbar'>
          <ToolbarView
            items={[
              <ButtonView
                key='add-operation'
                icon='plus'
                modifiers={['large']}
                disabled={program === undefined}
                onClick={() => dispatch(pushAddModalAction({}))}
              />,
              <ButtonView
                key='leave-program'
                icon='arrowUp'
                modifiers={['large']}
                onClick={() => dispatch(leaveProgramAction({}))}
                disabled={program === undefined || program.parentId === program.id}
              />,
              [
                <ButtonView
                  key='undo'
                  icon='undo'
                  modifiers={['large']}
                  onClick={() => dispatch(undoAction())}
                  disabled={useAppSelector(state => state.blueprint.past.length) === 0}
                />,
                <ButtonView
                  key='redo'
                  icon='redo'
                  modifiers={['large']}
                  onClick={() => dispatch(redoAction())}
                  disabled={useAppSelector(state => state.blueprint.future.length) === 0}
                />
              ],
              <ButtonView
                key='add-empty-program'
                icon='plus'
                modifiers={['large']}
                disabled={program === undefined}
                onClick={() => program !== undefined && dispatch(addEmptyProgramAction({
                  programId: program.id,
                  x: canvasPosition.x,
                  y: canvasPosition.y
                }))}
              >
                Program
              </ButtonView>,
              <ButtonView
                key='add-empty-control'
                icon='plus'
                modifiers={['large']}
                disabled={program === undefined}
                onClick={() => program !== undefined && dispatch(addEmptyControlAction({
                  programId: program.id,
                  x: canvasPosition.x - 320 * 0.5,
                  y: canvasPosition.y - 64 * 0.5
                }))}
              >
                Control
              </ButtonView>
            ]}
          />
        </div>
      </div>
    </header>
  )
}
