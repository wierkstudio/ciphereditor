
import './app.scss'
import AppHeaderView from '../../views/app-header/app-header'
import CanvasView from '../canvas/canvas'
import ModalStackView from '../../views/modal-stack/modal-stack'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useKeyBindingHandler from '../../hooks/useKeyBindingHandler'
import useResizeObserver from '../../hooks/useResizeObserver'
import useSettingsSelector from '../../hooks/useSettingsSelector'
import useUISelector from '../../hooks/useUISelector'
import useWindowLoadListener from '../../hooks/useWindowLoadListener'
import { UIEmbedType } from '../../slices/ui/types'
import { addNodesAction, loadBlueprintAction } from '../../slices/blueprint'
import { base64urlStringToBuffer, blueprintSchema, bufferToString, EditorMessage, editorMessageSchema, Size } from '@ciphereditor/library'
import { configureEmbedAction } from '../../slices/ui'
import { getAccessibilitySettings, getKeyBindings } from '../../slices/settings/selectors'
import { getCanvasState, getEmbedEnv, getEmbedType, isEmbedMaximized, isModalStackEmpty } from '../../slices/ui/selectors'
import { getPlaneCanvas } from '../../slices/blueprint/selectors/blueprint'
import { keyBindingTargetDispatchActions } from '../../slices/settings/key-bindings'
import { mergeModifiers, renderClassName, ViewModifiers } from '../../lib/utils/dom'
import { postWebsiteMessage } from '../../lib/embed'
import { useCallback, useEffect, useRef } from 'react'

export default function AppView (): JSX.Element {
  const dispatch = useAppDispatch()
  const appRef = useRef<HTMLDivElement | null>(null)

  // Retrieve settings
  const embedType = useUISelector(getEmbedType)
  const embedEnv = useUISelector(getEmbedEnv)
  const embedMaximized = useUISelector(isEmbedMaximized)
  const planeCanvas = useBlueprintSelector(getPlaneCanvas)
  const canvasState = useUISelector(getCanvasState)
  const keyBindings = useSettingsSelector(getKeyBindings)
  const { theme, reducedMotionPreference } =
    useSettingsSelector(getAccessibilitySettings)

  const onEditorMessage = useCallback((message: EditorMessage): void => {
    const messageType = message.type
    switch (messageType) {
      case 'configure': {
        const embedType = message.embedType as UIEmbedType | undefined
        const maximizable = message.maximizable
        const shareBaseUrl = message.shareBaseUrl
        dispatch(configureEmbedAction({ embedType, maximizable, shareBaseUrl }))
        break
      }
      case 'loadBlueprint': {
        const blueprint = message.blueprint
        dispatch(loadBlueprintAction({ blueprint }))
        break
      }
      case 'addNodes': {
        const nodes = message.nodes
        dispatch(addNodesAction({ nodes }))
        break
      }
    }
  }, [dispatch])

  // Handler for messages from the parent window via the postMessage API
  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      if (event.source === window.parent) {
        const result = editorMessageSchema.safeParse(event.data)
        if (result.success) {
          onEditorMessage(result.data)
        } else {
          // Messages that do not match the expected schema are silently ignored
          // as they may be posted by third party websites or browser extensions
        }
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

    const searchParams = new URLSearchParams(location.hash.substring(1))
    const blueprintParameter = searchParams.get('blueprint')
    if (blueprintParameter !== null) {
      const documentText = bufferToString(base64urlStringToBuffer(blueprintParameter))
      if (documentText !== undefined) {
        const blueprint = blueprintSchema.parse(JSON.parse(documentText))
        dispatch(loadBlueprintAction({ blueprint }))
      }
    }
  }, [])

  useWindowLoadListener(onAppLoad)

  // Shortcut handler, receives shortcut notation from a function that calls it,
  // this function looks up the shortcut notation in the shortcut "lookup" table
  // and dispatches the action
  const onKeyCombination = useCallback((
    shortcut: string,
    event: KeyboardEvent
  ) => {
    const targets = keyBindings[shortcut]
    if (targets !== undefined) {
      event.preventDefault()
      for (const target of (Array.isArray(targets) ? targets : [targets])) {
        const dispatchAction = keyBindingTargetDispatchActions[target]
        if (dispatchAction === undefined) {
          throw new Error(`Unexpected key binding target '${target}'`)
        } else {
          dispatch(dispatchAction)
        }
      }
    }
  }, [keyBindings, dispatch])

  useKeyBindingHandler(window, onKeyCombination)

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
      `canvas-mode-${planeCanvas ? 'plane' : 'line'}`,
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
  }, [embedType, theme, reducedMotionPreference, embedEnv, planeCanvas, canvasState])

  // Observe and react to intrinsic app size changes
  const onIntrinsicAppResize = useCallback((size: Size): void => {
    if (embedType !== UIEmbedType.Standalone) {
      postWebsiteMessage({
        type: 'intrinsicHeightChange',
        height: size.height
      })
    }
  }, [embedType])
  useResizeObserver(appRef, onIntrinsicAppResize)

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
      <div className='app__main'>
        <div className='app__header'>
          <AppHeaderView />
        </div>
        <div className='app__canvas'>
          <CanvasView />
        </div>
      </div>
      <div className='app__modals'>
        <ModalStackView />
      </div>
    </div>
  )
}
