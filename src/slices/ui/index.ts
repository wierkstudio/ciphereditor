
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { popModal, pushAddModal } from './reducers'
import { UICanvasState, UIState } from './types'

const defaultUIState: UIState = {
  canvasState: UICanvasState.Idle,
  canvasX: 0,
  canvasY: 0,
  modalStack: [],
}

export const settingsSlice = createSlice({
  name: 'ui',
  initialState: defaultUIState,
  reducers: {
    moveCanvasAction: (state, { payload }: PayloadAction<{
      x: number,
      y: number,
    }>) => {
      state.canvasX = payload.x
      state.canvasY = payload.y
    },
    pushAddModalAction: (state, { payload }: PayloadAction<{}>) => {
      pushAddModal(state)
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
    },
  }
})

export const {
  moveCanvasAction,
  pushAddModalAction,
  cancelTopModalAction,
  popModalAction,
} = settingsSlice.actions

export default settingsSlice.reducer
