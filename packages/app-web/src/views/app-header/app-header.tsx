
import './app-header.scss'
import ButtonView from '../../views/button/button'
import LogoView from '../../views/logo/logo'
import ToolbarView from '../../views/toolbar/toolbar'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useTranslation from '../../hooks/useTranslation'
import useUISelector from '../../hooks/useUISelector'
import { UIEmbedType } from '../../slices/ui/types'
import { getActiveProgram } from '../../slices/blueprint/selectors/program'
import { getEmbedType, isEmbedMaximizable, isEmbedMaximized } from '../../slices/ui/selectors'
import { leaveProgramAction, redoAction, undoAction } from '../../slices/blueprint'
import { openUrlAction, pushDeadEndModalAction, pushModalAction, toggleEmbedMaximizedAction } from '../../slices/ui'

export default function AppHeaderView (): JSX.Element {
  const dispatch = useAppDispatch()
  const program = useBlueprintSelector(getActiveProgram)
  const embedType = useUISelector(getEmbedType)
  const maximizable = useUISelector(isEmbedMaximizable)
  const maximized = useUISelector(isEmbedMaximized)
  const [t] = useTranslation()
  return (
    <header className='app-header'>
      <div className='app-header__start'>
        <div className='app-header__brand'>
          <LogoView />
        </div>
        <ToolbarView>
          <ButtonView
            title={t('Add node')}
            icon='plus'
            modifiers='large'
            disabled={program === undefined}
            onClick={() => dispatch(pushModalAction({
              payload: { type: 'add' }
            }))}
          />
          <ToolbarView.GroupView>
            <ButtonView
              title={t('Undo')}
              icon='undo'
              modifiers='large'
              onClick={() => dispatch(undoAction())}
              disabled={useAppSelector(state => state.blueprint.past.length) === 0}
            />
            <ButtonView
              title={t('Redo')}
              icon='redo'
              modifiers='large'
              onClick={() => dispatch(redoAction())}
              disabled={useAppSelector(state => state.blueprint.future.length) === 0}
            />
          </ToolbarView.GroupView>
          <ButtonView
            title={t('Share')}
            icon='share'
            modifiers='large'
            onClick={() => dispatch(pushDeadEndModalAction({}))}
          />
          {program !== undefined && program.parentId !== program.id && (
            <ButtonView
              title={t('Leave program')}
              icon='arrowUp'
              modifiers='large'
              onClick={() => dispatch(leaveProgramAction({}))}
              disabled={program === undefined || program.parentId === program.id}
            />
          )}
        </ToolbarView>
      </div>
      <div className='app-header__end'>
        <ToolbarView>
          <ButtonView
            title={t('Settings')}
            icon='settings'
            modifiers='large'
            onClick={() => dispatch(pushModalAction({
              payload: { type: 'settings' }
            }))}
          />
          {embedType !== UIEmbedType.Website && (
            <ButtonView
              title={t('View manual')}
              icon='help'
              modifiers='large'
              onClick={() => dispatch(openUrlAction({
                url: 'https://ciphereditor.com/manual'
              }))}
            />
          )}
          {maximizable && (
            <ButtonView
              title={maximized ? t('Show docs') : t('Hide docs')}
              icon={maximized ? 'minimize' : 'maximize'}
              modifiers='large'
              onClick={() => dispatch(toggleEmbedMaximizedAction({}))}
            />
          )}
        </ToolbarView>
      </div>
    </header>
  )
}
