
import { BlueprintNodeId } from '../blueprint/types/blueprint'
import { ModalPayload, UIState } from './types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { popModal, pushModal } from './reducers'
import { postWebsiteMessage } from '../../lib/embed'

const detectDefaultState = (): Partial<UIState> => {
  if (typeof (window as any).electronContext !== 'undefined') {
    return {
      embedType: 'electron',
      embedEnv: (window as any).electronContext.platform
    }
  } else {
    return {
      embedType: window.parent === window ? 'standalone' : 'embed',
      shareBaseUrl:
        // Use current location without hash
        location.href.substring(0, location.href.length - location.hash.length)
    }
  }
}

const defaultUIState: UIState = {
  embedType: 'standalone',
  embedEnv: 'chrome',
  embedMaximizable: false,
  embedMaximized: false,

  shareBaseUrl: 'https://app.ciphereditor.com/',

  canvasState: 'idle',

  modalStack: [],

  ...detectDefaultState()
}

export const settingsSlice = createSlice({
  name: 'ui',
  initialState: defaultUIState,
  reducers: {
    configureEmbedAction: (state, { payload }: PayloadAction<{
      embedType?: UIState['embedType']
      maximizable?: boolean
      shareBaseUrl?: string
    }>) => {
      if (payload.shareBaseUrl !== undefined) {
        state.shareBaseUrl = payload.shareBaseUrl
      }
      if (payload.embedType !== undefined) {
        state.embedType = payload.embedType
        if (state.embedType !== 'website') {
          state.embedMaximized = false
          state.embedMaximizable = false
        }
      }
      if (payload.maximizable !== undefined) {
        state.embedMaximizable = payload.maximizable
      }
    },
    toggleEmbedMaximizedAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.embedType === 'website') {
        state.embedMaximized = !state.embedMaximized
      }
    },
    startWireAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
    }>) => {
      if (state.canvasState === 'idle') {
        state.canvasState = 'wire'
        state.wireDraft = { sourceControlId: payload.controlId }
      }
    },
    targetWireAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId | undefined
    }>) => {
      if (state.canvasState === 'wire' && state.wireDraft !== undefined) {
        state.wireDraft = {
          ...state.wireDraft,
          targetControlId: payload.controlId
        }
      }
    },
    endWireAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.canvasState === 'wire') {
        state.canvasState = 'idle'
        state.wireDraft = undefined
      }
    },
    pushModalAction: (state, { payload }: PayloadAction<{
      payload: ModalPayload
    }>) => {
      pushModal(state, payload.payload)
    },
    toggleAddModalAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.modalStack.length === 1 && state.modalStack[0].type === 'add') {
        popModal(state)
      } else if (state.modalStack.length === 0) {
        pushModal(state, { type: 'add' })
      }
    },
    pushReportModalAction: (state, { payload }: PayloadAction<{
      title: string
      description: string
    }>) => {
      pushModal(state, {
        type: 'report',
        title: payload.title,
        description: payload.description
      })
    },
    pushDeadEndModalAction: (state, { payload }: PayloadAction<{}>) => {
      pushModal(state, {
        type: 'report',
        title: 'You\'ve reached a dead-end.',
        description:
          'You have found a part of this app that is yet to be built. ' +
          'Check back again later. In the meantime you may leave us some ' +
          'feedback about your experience so far. We would really appreciate it.'
      })
    },
    popModalAction: (state, { payload }: PayloadAction<{}>) => {
      popModal(state)
    },
    openUrlAction: (state, { payload }: PayloadAction<{
      url: string
    }>) => {
      // TODO: This action has side effects, is that allowed?
      if (state.embedType === 'website') {
        // Ask parent website to open the given URL
        postWebsiteMessage({ type: 'open', url: payload.url })

        // Minimize embed to make docs visible
        if (state.embedMaximizable) {
          state.embedMaximized = false
        }
      } else {
        // Open the given URL in a new tab
        window.open(payload.url, '_blank')
      }
    }
  }
})

export const {
  configureEmbedAction,
  toggleEmbedMaximizedAction,
  startWireAction,
  targetWireAction,
  endWireAction,
  pushModalAction,
  toggleAddModalAction,
  pushReportModalAction,
  pushDeadEndModalAction,
  popModalAction,
  openUrlAction
} = settingsSlice.actions

export default settingsSlice.reducer
