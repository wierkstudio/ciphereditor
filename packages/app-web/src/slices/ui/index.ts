
import { BlueprintNodeId } from '../blueprint/types/blueprint'
import { ModalPayload, UICanvasMode, UICanvasState, UIEmbedType, UIState } from './types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { popModal, pushModal } from './reducers'
import { postWebsiteMessage } from '../../lib/embed'

const detectDefaultState = (): Partial<UIState> => {
  if (typeof (window as any).electronContext !== 'undefined') {
    return {
      embedType: UIEmbedType.Electron,
      embedEnv: (window as any).electronContext.platform
    }
  } else {
    return {
      embedType:
        window.parent === window
          ? UIEmbedType.Standalone
          : UIEmbedType.Embed
    }
  }
}

const defaultUIState: UIState = {
  embedType: UIEmbedType.Standalone,
  embedEnv: 'chrome',
  embedMaximizable: false,
  embedMaximized: false,

  canvasMode: UICanvasMode.Plane,
  canvasState: UICanvasState.Idle,
  canvasOffsetX: 0,
  canvasOffsetY: 0,
  canvasWidth: 1,
  canvasHeight: 1,

  modalStack: [],

  ...detectDefaultState()
}

export const settingsSlice = createSlice({
  name: 'ui',
  initialState: defaultUIState,
  reducers: {
    configureEmbedAction: (state, { payload }: PayloadAction<{
      embedType?: UIEmbedType
      maximizable?: boolean
    }>) => {
      if (payload.embedType !== undefined) {
        state.embedType = payload.embedType
        if (state.embedType !== UIEmbedType.Website) {
          state.embedMaximized = false
          state.embedMaximizable = false
        }
      }
      if (payload.maximizable !== undefined) {
        state.embedMaximizable = payload.maximizable
      }
    },
    toggleEmbedMaximizedAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.embedType === UIEmbedType.Website) {
        state.embedMaximized = !state.embedMaximized
      }
    },
    moveCanvasAction: (state, { payload }: PayloadAction<{
      x: number
      y: number
    }>) => {
      state.canvasOffsetX = payload.x
      state.canvasOffsetY = payload.y
    },
    updateCanvasSizeAction: (state, { payload }: PayloadAction<{
      width: number
      height: number
    }>) => {
      const previousWidth = state.canvasWidth
      state.canvasWidth = payload.width
      state.canvasHeight = payload.height

      if (previousWidth !== payload.width) {
        // TODO: Move magic numbers
        const newCanvasMode =
          payload.width > 719
            ? UICanvasMode.Plane
            : UICanvasMode.Sequential
        if (state.canvasMode !== newCanvasMode) {
          state.canvasMode = newCanvasMode
          // TODO: Transition from one mode to the other
        }
      }
    },
    startWireAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
    }>) => {
      if (state.canvasState === UICanvasState.Idle) {
        state.canvasState = UICanvasState.Wire
        state.wireDraft = { sourceControlId: payload.controlId }
      }
    },
    targetWireAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId | undefined
    }>) => {
      if (state.canvasState === UICanvasState.Wire && state.wireDraft !== undefined) {
        state.wireDraft = {
          ...state.wireDraft,
          targetControlId: payload.controlId
        }
      }
    },
    endWireAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.canvasState === UICanvasState.Wire) {
        state.canvasState = UICanvasState.Idle
        state.wireDraft = undefined
      }
    },
    pushModalAction: (state, { payload }: PayloadAction<{
      payload: ModalPayload
    }>) => {
      pushModal(state, payload.payload)
    },
    pushAddModalAction: (state, { payload }: PayloadAction<{}>) => {
      pushModal(state, { type: 'add' })
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
      if (state.embedType === UIEmbedType.Website) {
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
  moveCanvasAction,
  updateCanvasSizeAction,
  startWireAction,
  targetWireAction,
  endWireAction,
  pushModalAction,
  pushAddModalAction,
  pushReportModalAction,
  pushDeadEndModalAction,
  popModalAction,
  openUrlAction
} = settingsSlice.actions

export default settingsSlice.reducer
