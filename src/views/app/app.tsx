
import './app.scss'
import AppHeaderView from 'views/app-header/app-header'
import CanvasView from '../canvas/canvas'
import ModalStackView from 'views/modal-stack/modal-stack'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useClassName from 'hooks/useClassName'
import useShortcutHandler from 'hooks/useShortcutHandler'
import { getShortcutBindings } from 'slices/settings/selectors'
import { isModalStackEmpty } from 'slices/ui/selectors'
import { useCallback } from 'react'

export default function AppView() {
  const dispatch = useAppDispatch()

  const shortcutBindings = useAppSelector(state => getShortcutBindings(state.settings))
  const onShortcut = useCallback((shortcut: string, event: KeyboardEvent) => {
    const action = shortcutBindings[shortcut]
    if (action !== undefined) {
      dispatch({ type: action, payload: {} })
    } else {
      console.log('Shortcut', shortcut)
    }
  }, [shortcutBindings, dispatch])

  useShortcutHandler(window, onShortcut)

  const hasModals = !useAppSelector(state => isModalStackEmpty(state.ui))
  return (
    <div className={useClassName('app', hasModals ? ['modals'] : [])}>
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
