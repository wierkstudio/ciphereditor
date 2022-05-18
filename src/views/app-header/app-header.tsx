
import './app-header.scss'
import ButtonView from 'views/button/button'
import LogoView from 'views/logo/logo'
import ToolbarView from 'views/toolbar/toolbar'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useUISelector from 'hooks/useUISelector'
import { UIEmbedType } from 'slices/ui/types'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getEmbedType, isEmbedMaximized } from 'slices/ui/selectors'
import { leaveProgramAction, redoAction, undoAction } from 'slices/blueprint'
import { pushAddModalAction, pushSettingsModalAction, toggleEmbedMaximizedAction } from 'slices/ui'

export default function AppHeaderView (): JSX.Element {
  const dispatch = useAppDispatch()
  const program = useBlueprintSelector(state => getActiveProgram(state))
  const embedType = useUISelector(getEmbedType)
  const maximized = useUISelector(isEmbedMaximized)

  // TODO: Needs implementation
  const onNeedsImplementation = (): void => {
    alert('You have reached the end of this prototype. Come back later.')
  }

  return (
    <header className='app-header'>
      <div className='app-header__start'>
        <div className='app-header__brand'>
          <LogoView />
        </div>
        <ToolbarView
          items={[
            <ButtonView
              key='add-node'
              title='Add node'
              icon='plus'
              modifiers={['large']}
              disabled={program === undefined}
              onClick={() => dispatch(pushAddModalAction({}))}
            />,
            [
              <ButtonView
                key='undo'
                title='Undo'
                icon='undo'
                modifiers={['large']}
                onClick={() => dispatch(undoAction())}
                disabled={useAppSelector(state => state.blueprint.past.length) === 0}
              />,
              <ButtonView
                key='redo'
                title='Redo'
                icon='redo'
                modifiers={['large']}
                onClick={() => dispatch(redoAction())}
                disabled={useAppSelector(state => state.blueprint.future.length) === 0}
              />
            ],
            <ButtonView
              key='share'
              title='Share'
              icon='share'
              modifiers={['large']}
              onClick={onNeedsImplementation}
            />
          ].concat(program !== undefined && program.parentId !== program.id
            ? [
              <ButtonView
                key='leave-program'
                title='Leave program'
                icon='arrowUp'
                modifiers={['large']}
                onClick={() => dispatch(leaveProgramAction({}))}
                disabled={program === undefined || program.parentId === program.id}
              />
              ]
            : [])}
        />
      </div>
      <div className='app-header__end'>
        <ToolbarView
          items={[
            <ButtonView
              key='settings'
              title='Settings'
              icon='settings'
              modifiers={['large']}
              onClick={() => dispatch(pushSettingsModalAction({}))}
            />
          ].concat([
            embedType !== UIEmbedType.Platform
              ? <ButtonView
                  key='view-manual'
                  title='View manual'
                  icon='help'
                  modifiers={['large']}
                  onClick={() => {
                    window.open('https://cryptii.blue/manual', '_blank')
                  }}
                />
              : (maximized
                  ? <ButtonView
                      key='minimize'
                      title='Show docs'
                      icon='minimize'
                      modifiers={['large']}
                      onClick={() => dispatch(toggleEmbedMaximizedAction({}))}
                    />
                  : <ButtonView
                      key='maximize'
                      title='Hide docs'
                      icon='maximize'
                      modifiers={['large']}
                      onClick={() => dispatch(toggleEmbedMaximizedAction({}))}
                    />
                )
          ])}
        />
      </div>
    </header>
  )
}
