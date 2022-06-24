
import './app.scss'
import AppHeaderView from '../../views/app-header/app-header'
import CanvasView from '../canvas/canvas'
import ModalStackView from '../../views/modal-stack/modal-stack'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useSettingsSelector from '../../hooks/useSettingsSelector'
import useShortcutHandler from '../../hooks/useShortcutHandler'
import useUISelector from '../../hooks/useUISelector'
import useWindowLoadListener from '../../hooks/useWindowLoadListener'
import { UIEmbedType } from '../../slices/ui/types'
import { applyEmbedTypeAction } from '../../slices/ui'
import { getAccessibilitySettings, getShortcutBindings } from '../../slices/settings/selectors'
import { getEmbedEnv, getEmbedType, isEmbedMaximized, isModalStackEmpty } from '../../slices/ui/selectors'
import { mergeModifiers, renderClassName, ViewModifiers } from '../../utils/dom'
import { postAccessibilityChangedMessage, postInitiatedMessage, postMaximizedChangedMessage, postIntrinsicHeightChangeMessage } from '../../utils/embed'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export default function AppView (): JSX.Element {
  const dispatch = useAppDispatch()
  const appRef = useRef<HTMLDivElement | null>(null)

  // Retrieve settings
  const embedType = useUISelector(getEmbedType)
  const embedEnv = useUISelector(getEmbedEnv)
  const embedMaximized = useUISelector(isEmbedMaximized)
  const shortcutBindings = useSettingsSelector(getShortcutBindings)
  const { theme, reducedMotionPreference } =
    useSettingsSelector(getAccessibilitySettings)

  // Parent frame message handler
  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      if (event.source === window.parent) {
        // TODO: Validate messages with Zod schemas
        const message = event.data
        switch (message.type ?? '') {
          case 'configure': {
            if (message.embedType === 'platform') {
              dispatch(applyEmbedTypeAction({
                embedType: UIEmbedType.Platform
              }))
            }
            break
          }
        }
      }
    }

    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [dispatch])

  // Document load handler
  const onAppLoad = useCallback(() => {
    if (window.parent !== window) {
      postInitiatedMessage()
    }
  }, [])

  useWindowLoadListener(onAppLoad)

  // Shortcut handler
  const onShortcut = useCallback((shortcut: string, event: KeyboardEvent) => {
    const actions = shortcutBindings[shortcut]
    if (actions === undefined) {
      console.log('Unhandled shortcut', shortcut)
    } else if (typeof actions === 'string') {
      dispatch({ type: actions, payload: {} })
    } else {
      for (const action of actions) {
        dispatch({ type: action, payload: {} })
      }
    }
  }, [shortcutBindings, dispatch])

  useShortcutHandler(window, onShortcut)

  // Modals modifier
  const hasModals = !useAppSelector(state => isModalStackEmpty(state.ui))
  let modifiers: ViewModifiers = []
  if (hasModals) {
    modifiers = mergeModifiers(modifiers, ['modals'])
  }

  // React to accessibility changes
  useEffect(() => {
    // Update document element class names to apply accessibility settings
    const modifiers = [
      'script-enabled',
      `embed-${embedType as string}`,
      `env-${embedEnv}`,
      `theme-${theme as string}`,
      `reduced-motion-${reducedMotionPreference as string}`
    ]
    const className = renderClassName('root', modifiers)
    document.documentElement.className = className

    // Notify parent frame about updated accessibility settings, if any
    if (embedType !== UIEmbedType.Standalone) {
      postAccessibilityChangedMessage({ theme, reducedMotionPreference })
    }
  }, [embedType, theme, reducedMotionPreference, embedEnv])

  // Observe and react to intrinsic app size changes
  const intrinsicAppSizeObserver = useMemo(() => {
    return new ResizeObserver(entries => {
      for (const entry of entries) {
        if (embedType !== UIEmbedType.Standalone) {
          postIntrinsicHeightChangeMessage({ height: entry.contentRect.height })
        }
      }
    })
  }, [embedType])

  useEffect(() => {
    const appElement = appRef.current
    if (appElement !== null) {
      intrinsicAppSizeObserver.observe(appElement)
      // Initial observation
      const rect = appElement.getBoundingClientRect()
      postIntrinsicHeightChangeMessage({ height: rect.height })
      return () => {
        intrinsicAppSizeObserver.unobserve(appElement)
      }
    }
  }, [intrinsicAppSizeObserver, appRef])

  // React to maximized changes
  useEffect(() => {
    if (embedType !== UIEmbedType.Standalone) {
      postMaximizedChangedMessage({ maximized: embedMaximized })
    }
  }, [embedType, embedMaximized])

  return (
    <div ref={appRef} className={renderClassName('app', modifiers)}>
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
