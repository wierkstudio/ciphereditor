
import './app.scss'
import AppHeaderView from 'views/app-header/app-header'
import CanvasView from '../canvas/canvas'
import ModalStackView from 'views/modal-stack/modal-stack'
import { getShortcutBindings } from 'slices/settings/selectors'
import { isModalStackEmpty } from 'slices/ui/selectors'
import { useAppSelector } from 'hooks/useAppSelector'
import { useAppShortcuts } from 'hooks/useAppShortcuts'
import { useClassNames } from 'hooks/useClassNames'

export default function AppView() {
  const shortcutBindings = useAppSelector(state => getShortcutBindings(state.settings))
  useAppShortcuts(shortcutBindings)

  const hasModals = !useAppSelector(state => isModalStackEmpty(state.ui))
  return (
    <div className={useClassNames('app', hasModals ? ['modals'] : [])}>
      <div className="app__content">
        <AppHeaderView />
        <CanvasView />
      </div>
      <div className="app__modals">
        <ModalStackView />
      </div>
    </div>
  )
}
