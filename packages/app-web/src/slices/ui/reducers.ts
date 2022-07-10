
import { ModalPayload, UIState } from './types'

export const pushModal = (state: UIState, payload: ModalPayload): void => {
  state.modalStack.push(payload)
}

export const popModal = (state: UIState): void => {
  state.modalStack.splice(state.modalStack.length - 1, 1)
}
