
import { getShortcutBindings } from 'slices/settings/selectors'
import { useAppSelector, useAppShortcuts } from 'utils/hooks'
import BarView from '../bar/bar'
import BlueprintView from '../blueprint/blueprint'
import './app.css'

export default function AppView() {
  const shortcutBindings = useAppSelector(state => getShortcutBindings(state.settings))
  useAppShortcuts(shortcutBindings)
  return (
    <div className="app">
      <BarView />
      <BlueprintView />
    </div>
  )
}
