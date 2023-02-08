
import { ModalPayload, UIState } from './types'

export const pushModal = (state: UIState, payload: ModalPayload): void => {
  // TODO: Transition from previous state
  state.modalStack.push(payload)
  state.canvasState = 'modal'
}

export const popModal = (state: UIState): void => {
  if (state.canvasState === 'modal') {
    state.modalStack.splice(state.modalStack.length - 1, 1)
    if (state.modalStack.length === 0) {
      state.canvasState = 'idle'
    }
  }
}
