
import './app.scss'
import AppHeaderView from 'views/app-header/app-header'
import BlueprintView from '../blueprint/blueprint'
import ModalStackView from 'views/modal-stack/modal-stack'
import { getShortcutBindings } from 'slices/settings/selectors'
import { useAppClassName, useAppSelector, useAppShortcuts } from 'utils/hooks'
import { isModalStackEmpty } from 'slices/ui/selectors'

export default function AppView() {
  const shortcutBindings = useAppSelector(state => getShortcutBindings(state.settings))
  useAppShortcuts(shortcutBindings)

  const hasModals = !useAppSelector(state => isModalStackEmpty(state.ui))
  return (
    <div className={useAppClassName('app', hasModals ? ['modals'] : [])}>
      <div className="app__content">
        <AppHeaderView />
        <BlueprintView />
      </div>
      <div className="app__modals">
        <ModalStackView />
      </div>
    </div>
  )
}
