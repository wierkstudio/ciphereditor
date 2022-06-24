
import './app-header.scss'
import ButtonView from '../../views/button/button'
import LogoView from '../../views/logo/logo'
import ToolbarView from '../../views/toolbar/toolbar'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useUISelector from '../../hooks/useUISelector'
import { UIEmbedType } from '../../slices/ui/types'
import { getActiveProgram } from '../../slices/blueprint/selectors/program'
import { getEmbedType, isEmbedMaximized } from '../../slices/ui/selectors'
import { getSelectedNode } from '../../slices/blueprint/selectors/blueprint'
import { leaveProgramAction, redoAction, removeNodeAction, undoAction } from '../../slices/blueprint'
import { pushAddModalAction, pushDeadEndModalAction, pushSettingsModalAction, toggleEmbedMaximizedAction } from '../../slices/ui'

export default function AppHeaderView (): JSX.Element {
  const dispatch = useAppDispatch()
  const program = useBlueprintSelector(getActiveProgram)
  const selectedNode = useBlueprintSelector(getSelectedNode)
  const embedType = useUISelector(getEmbedType)
  const maximized = useUISelector(isEmbedMaximized)
  return (
    <header className='app-header'>
      <div className='app-header__start'>
        {embedType !== UIEmbedType.Electron && (
          <div className='app-header__brand'>
            <LogoView />
          </div>
        )}
        <ToolbarView>
          <ButtonView
            title='Add node'
            icon='plus'
            modifiers='large'
            disabled={program === undefined}
            onClick={() => dispatch(pushAddModalAction({}))}
          />
          <ToolbarView.GroupView>
            <ButtonView
              title='Undo'
              icon='undo'
              modifiers='large'
              onClick={() => dispatch(undoAction())}
              disabled={useAppSelector(state => state.blueprint.past.length) === 0}
            />
            <ButtonView
              title='Redo'
              icon='redo'
              modifiers='large'
              onClick={() => dispatch(redoAction())}
              disabled={useAppSelector(state => state.blueprint.future.length) === 0}
            />
          </ToolbarView.GroupView>
          <ButtonView
            title='Share'
            icon='share'
            modifiers='large'
            onClick={() => dispatch(pushDeadEndModalAction({}))}
          />
          {program !== undefined && program.parentId !== program.id && (
            <ButtonView
              title='Leave program'
              icon='arrowUp'
              modifiers='large'
              onClick={() => dispatch(leaveProgramAction({}))}
              disabled={program === undefined || program.parentId === program.id}
            />
          )}
          {selectedNode !== undefined && (
            <ButtonView
              title='Remove node'
              icon='trash'
              modifiers='large'
              onClick={() => dispatch(removeNodeAction({ nodeId: selectedNode.id }))}
            />
          )}
        </ToolbarView>
      </div>
      <div className='app-header__end'>
        <ToolbarView>
          <ButtonView
            title='Settings'
            icon='settings'
            modifiers='large'
            onClick={() => dispatch(pushSettingsModalAction({}))}
          />
          {embedType !== UIEmbedType.Platform && (
            <ButtonView
              title='View manual'
              icon='helpCircle'
              modifiers='large'
              onClick={() => {
                window.open('https://cryptii.blue/manual', '_blank')
              }}
            />
          )}
          {embedType === UIEmbedType.Platform && (
            <ButtonView
              title={maximized ? 'Show docs' : 'Hide docs'}
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
