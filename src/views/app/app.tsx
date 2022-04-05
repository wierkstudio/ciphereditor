
import './app.scss'
import AppHeaderView from 'views/app-header/app-header'
import CanvasView from '../canvas/canvas'
import ModalStackView from 'views/modal-stack/modal-stack'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useClassName, { mergeModifiers, ViewModifiers } from 'hooks/useClassName'
import useShortcutHandler from 'hooks/useShortcutHandler'
import { getReducedMotionPreference, getScaling, getShortcutBindings, getTheme } from 'slices/settings/selectors'
import { isModalStackEmpty } from 'slices/ui/selectors'
import { useCallback, useEffect } from 'react'

export default function AppView (): JSX.Element {
  const dispatch = useAppDispatch()

  const shortcutBindings = useAppSelector(state => getShortcutBindings(state.settings))
  const theme = useAppSelector(state => getTheme(state.settings))
  const scaling = useAppSelector(state => getScaling(state.settings))
  const reducedMotionPreference = useAppSelector(state => getReducedMotionPreference(state.settings))

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

  let modifiers: ViewModifiers = []
  if (hasModals) {
    modifiers = mergeModifiers(modifiers, ['modals'])
  }

  useEffect(() => {
    const htmlClassNames = [
      'theme-' + theme,
      'scaling-' + scaling,
      'reduced-motion-' + reducedMotionPreference
    ]
    document.documentElement.className = htmlClassNames.join(' ')
  }, [theme, scaling, reducedMotionPreference])

  return (
    <div className={useClassName('app', modifiers)}>
      <div className='app__content'>
        <AppHeaderView />
        <CanvasView />
      </div>
      <div className='app__modals'>
        <ModalStackView />
      </div>
    </div>
  )
}
