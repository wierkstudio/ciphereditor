
import './app-header.scss'
import {
  copyAction,
  deleteAction,
  leaveProgramAction,
  pasteAction,
  redoAction,
  undoAction
} from '../../slices/blueprint'
import ButtonView from '../../views/button/button'
import ToolbarView from '../../views/toolbar/toolbar'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useSettingsSelector from '../../hooks/useSettingsSelector'
import useTranslation from '../../hooks/useTranslation'
import useUISelector from '../../hooks/useUISelector'
import { getActiveProgram } from '../../slices/blueprint/selectors/program'
import { getEmbedType, isEmbedMaximizable, isEmbedMaximized } from '../../slices/ui/selectors'
import { getHasSelection, getPlaneCanvas } from '../../slices/blueprint/selectors/blueprint'
import { getKeyCombination } from '../../slices/settings/selectors'
import { openUrlAction, pushModalAction, toggleEmbedMaximizedAction } from '../../slices/ui'

export default function AppHeaderView (): JSX.Element {
  const dispatch = useAppDispatch()
  const rootProgramId = useBlueprintSelector(state => state.rootProgramId)
  const program = useBlueprintSelector(getActiveProgram)
  const embedType = useUISelector(getEmbedType)
  const planeCanvas = useBlueprintSelector(getPlaneCanvas)
  const maximizable = useUISelector(isEmbedMaximizable)
  const maximized = useUISelector(isEmbedMaximized)
  const [t] = useTranslation()

  // Button enabled states
  const hasSelection = useBlueprintSelector(getHasSelection)
  const undoEnabled = useAppSelector(state => state.blueprint.past.length > 0)
  const redoEnabled = useAppSelector(state => state.blueprint.future.length > 0)
  const leaveProgramEnabled =
    program !== undefined &&
    (program.id !== rootProgramId || program.childIds.length > 0)

  // Gather key bindings
  const toggleAddModalKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'toggleAddModal'))
  const copyKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'copy'))
  const pasteKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'paste'))
  const deleteKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'delete'))
  const undoKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'undo'))
  const redoKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'redo'))
  const leaveProgramKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'leaveProgram'))
  const saveBlueprintKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'saveBlueprint'))
  const showSettingsKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'showSettings'))
  const toggleMaximizedKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'toggleMaximized'))

  return (
    <header className='app-header'>
      <div className='app-header__toolbar'>
        <ToolbarView>
          {embedType !== 'website' && embedType !== 'electron' && (
            <ToolbarView.BrandView />
          )}
          <ButtonView
            title={t('Add node')}
            keyCombination={toggleAddModalKeyCombination}
            icon='plus'
            modifiers='large alt'
            onClick={() => dispatch(pushModalAction({
              payload: { type: 'add' }
            }))}
          />
          {planeCanvas && (
            <ToolbarView.GroupView>
              <ButtonView
                title={t('Copy')}
                keyCombination={copyKeyCombination}
                icon='copy'
                modifiers='large alt'
                onClick={() => dispatch(copyAction({}))}
                disabled={!hasSelection}
              />
              <ButtonView
                title={t('Paste')}
                keyCombination={pasteKeyCombination}
                icon='paste'
                modifiers='large alt'
                onClick={() => dispatch(pasteAction({}))}
              />
              <ButtonView
                title={t('Delete')}
                keyCombination={deleteKeyCombination}
                icon='trash'
                modifiers='large alt'
                onClick={() => dispatch(deleteAction({}))}
                disabled={!hasSelection}
              />
            </ToolbarView.GroupView>
          )}
          <ToolbarView.GroupView>
            <ButtonView
              title={t('Undo')}
              keyCombination={undoKeyCombination}
              icon='undo'
              modifiers='large alt'
              onClick={() => dispatch(undoAction())}
              disabled={!undoEnabled}
            />
            <ButtonView
              title={t('Redo')}
              keyCombination={redoKeyCombination}
              icon='redo'
              modifiers='large alt'
              onClick={() => dispatch(redoAction())}
              disabled={!redoEnabled}
            />
          </ToolbarView.GroupView>
          <ButtonView
            title={t('Leave program')}
            keyCombination={leaveProgramKeyCombination}
            icon='arrowUp'
            modifiers='large alt'
            onClick={() => dispatch(leaveProgramAction({}))}
            disabled={!leaveProgramEnabled}
          />
          <ButtonView
            title={t('Save')}
            keyCombination={saveBlueprintKeyCombination}
            icon='save'
            modifiers='large alt'
            onClick={() => dispatch(pushModalAction({ payload: { type: 'save' } }))}
          />
          <ToolbarView.SpacerView />
          <ButtonView
            title={t('Settings')}
            keyCombination={showSettingsKeyCombination}
            icon='settings'
            modifiers='large alt'
            onClick={() => dispatch(pushModalAction({
              payload: { type: 'settings' }
            }))}
          />
          {embedType !== 'website' && (
            <ButtonView
              title={t('View docs')}
              icon='help'
              modifiers='large alt'
              onClick={() => dispatch(openUrlAction({
                url: 'https://ciphereditor.com/docs'
              }))}
            />
          )}
          {maximizable && (
            <ButtonView
              title={maximized ? t('Show docs') : t('Hide docs')}
              keyCombination={toggleMaximizedKeyCombination}
              icon={maximized ? 'minimize' : 'maximize'}
              modifiers='large alt'
              onClick={() => dispatch(toggleEmbedMaximizedAction({}))}
            />
          )}
        </ToolbarView>
      </div>
    </header>
  )
}
