
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { popModal, pushAddModal } from './reducers'
import { UIState } from './types'

const defaultUIState: UIState = {
  modalStack: []
}

export const settingsSlice = createSlice({
  name: 'ui',
  initialState: defaultUIState,
  reducers: {
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
  pushAddModalAction,
  cancelTopModalAction,
  popModalAction,
} = settingsSlice.actions

export default settingsSlice.reducer
