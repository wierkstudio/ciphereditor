
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
import { EditorMessage, editorMessageSchema } from '../../lib/embed/types'
import { UIEmbedType } from '../../slices/ui/types'
import { configureEmbedAction } from '../../slices/ui'
import { getAccessibilitySettings, getShortcutBindings } from '../../slices/settings/selectors'
import { getCanvasMode, getCanvasState, getEmbedEnv, getEmbedType, isEmbedMaximized, isModalStackEmpty } from '../../slices/ui/selectors'
import { mergeModifiers, renderClassName, ViewModifiers } from '../../lib/utils/dom'
import { postWebsiteMessage } from '../../lib/embed'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export default function AppView (): JSX.Element {
  const dispatch = useAppDispatch()
  const appRef = useRef<HTMLDivElement | null>(null)

  // Retrieve settings
  const embedType = useUISelector(getEmbedType)
  const embedEnv = useUISelector(getEmbedEnv)
  const embedMaximized = useUISelector(isEmbedMaximized)
  const canvasMode = useUISelector(getCanvasMode)
  const canvasState = useUISelector(getCanvasState)
  const shortcutBindings = useSettingsSelector(getShortcutBindings)
  const { theme, reducedMotionPreference } =
    useSettingsSelector(getAccessibilitySettings)

  const onEditorMessage = useCallback((message: EditorMessage): void => {
    const messageType = message.type
    switch (messageType) {
      case 'configure': {
        dispatch(configureEmbedAction({
          embedType: message.embedType as UIEmbedType | undefined,
          maximizable: message.maximizable
        }))
        break
      }
    }
  }, [dispatch])

  // Editor message handler
  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      if (event.source === window.parent) {
        onEditorMessage(editorMessageSchema.parse(event.data))
      }
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [onEditorMessage])

  // Document load handler
  // TODO: Dedupe this call
  const onAppLoad = useCallback(() => {
    if (window.parent !== window) {
      postWebsiteMessage({ type: 'initiated' })
    }
  }, [])

  useWindowLoadListener(onAppLoad)

  // Shortcut handler
  const onShortcut = useCallback((shortcut: string, event: KeyboardEvent) => {
    const actions = shortcutBindings[shortcut]
    if (actions !== undefined) {
      if (typeof actions === 'string') {
        dispatch({ type: actions, payload: {} })
      } else {
        for (const action of actions) {
          dispatch({ type: action, payload: {} })
        }
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
      `canvas-mode-${canvasMode}`,
      `canvas-state-${canvasState}`,
      `theme-${theme as string}`,
      `reduced-motion-${reducedMotionPreference as string}`
    ]
    const className = renderClassName('root', modifiers)
    document.documentElement.className = className

    // Notify parent frame about updated accessibility settings, if any
    if (embedType !== UIEmbedType.Standalone) {
      postWebsiteMessage({
        type: 'settingsChange',
        theme,
        reducedMotionPreference
      })
    }
  }, [embedType, theme, reducedMotionPreference, embedEnv, canvasMode, canvasState])

  // Observe and react to intrinsic app size changes
  const intrinsicAppSizeObserver = useMemo(() => {
    return new ResizeObserver(entries => {
      for (const entry of entries) {
        if (embedType !== UIEmbedType.Standalone) {
          postWebsiteMessage({
            type: 'intrinsicHeightChange',
            height: entry.contentRect.height
          })
        }
      }
    })
  }, [embedType])

  useEffect(() => {
    const appElement = appRef.current
    if (appElement !== null) {
      intrinsicAppSizeObserver.observe(appElement)
      // Initial observation
      if (embedType !== UIEmbedType.Standalone) {
        const rect = appElement.getBoundingClientRect()
        postWebsiteMessage({
          type: 'intrinsicHeightChange',
          height: rect.height
        })
      }
      return () => {
        intrinsicAppSizeObserver.unobserve(appElement)
      }
    }
  }, [intrinsicAppSizeObserver, appRef, embedType])

  // React to maximized changes
  useEffect(() => {
    if (embedType !== UIEmbedType.Standalone) {
      postWebsiteMessage({
        type: 'maximizedChange',
        maximized: embedMaximized
      })
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
