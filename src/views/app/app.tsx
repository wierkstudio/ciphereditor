
import './app.scss'
import AppHeaderView from 'views/app-header/app-header'
import BlueprintView from '../blueprint/blueprint'
import { getShortcutBindings } from 'slices/settings/selectors'
import { useAppSelector, useAppShortcuts } from 'utils/hooks'

export default function AppView() {
  const shortcutBindings = useAppSelector(state => getShortcutBindings(state.settings))
  useAppShortcuts(shortcutBindings)
  return (
    <div className="app">
      <AppHeaderView />
      <BlueprintView />
    </div>
  )
}
