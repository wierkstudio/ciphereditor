
import { BlueprintNodeId } from '../blueprint/types/blueprint'
import { UICanvasState, UIEmbedType, UIState } from './types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { popModal, pushAddModal, pushReportModal, pushSettingsModal } from './reducers'

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
  embedMaximized: false,

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
    applyEmbedTypeAction: (state, { payload }: PayloadAction<{
      embedType: UIEmbedType
    }>) => {
      state.embedType = payload.embedType
      if (state.embedType !== UIEmbedType.Platform) {
        state.embedMaximized = false
      }
    },
    toggleEmbedMaximizedAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.embedType === UIEmbedType.Platform) {
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
      state.canvasWidth = payload.width
      state.canvasHeight = payload.height
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
    pushAddModalAction: (state, { payload }: PayloadAction<{}>) => {
      pushAddModal(state)
    },
    pushSettingsModalAction: (state, { payload }: PayloadAction<{}>) => {
      pushSettingsModal(state)
    },
    pushReportModalAction: (state, { payload }: PayloadAction<{
      title: string
      description: string
    }>) => {
      pushReportModal(state, payload.title, payload.description)
    },
    pushDeadEndModalAction: (state, { payload }: PayloadAction<{}>) => {
      pushReportModal(
        state,
        'You\'ve reached a dead-end.',
        'You have found a part of this app that is yet to be built. ' +
        'Check back again later. In the meantime you may leave us some ' +
        'feedback about your experience so far. We would really appreciate it.'
      )
    },
    cancelTopModalAction: (state, { payload }: PayloadAction<{}>) => {
      const cancelable =
        state.modalStack.length > 0 &&
        state.modalStack[state.modalStack.length - 1].cancelable
      if (cancelable) {
        popModal(state)
      }
    },
    popModalAction: (state, { payload }: PayloadAction<{}>) => {
      popModal(state)
    }
  }
})

export const {
  applyEmbedTypeAction,
  toggleEmbedMaximizedAction,
  moveCanvasAction,
  updateCanvasSizeAction,
  startWireAction,
  targetWireAction,
  endWireAction,
  pushAddModalAction,
  pushSettingsModalAction,
  pushReportModalAction,
  pushDeadEndModalAction,
  cancelTopModalAction,
  popModalAction
} = settingsSlice.actions

export default settingsSlice.reducer
