
import { ModalPayload, UICanvasState, UIState } from './types'

export const pushModal = (state: UIState, payload: ModalPayload): void => {
  // TODO: Transition from previous state
  state.modalStack.push(payload)
  state.canvasState = UICanvasState.Modal
}

export const popModal = (state: UIState): void => {
  if (state.canvasState === UICanvasState.Modal) {
    state.modalStack.splice(state.modalStack.length - 1, 1)
    if (state.modalStack.length === 0) {
      state.canvasState = UICanvasState.Idle
    }
  }
}
