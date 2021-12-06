
import { getShortcutBindings } from 'slices/settings/selectors'
import { useAppSelector, useAppShortcuts } from 'utils/hooks'
import Bar from '../bar/bar'
import Blueprint from '../blueprint/blueprint'
import './app.css'

function App() {
  const shortcutBindings = useAppSelector(state => getShortcutBindings(state.settings))
  useAppShortcuts(shortcutBindings)

  return (
    <div className="app">
      <Bar />
      <Blueprint />
    </div>
  )
}

export default App
