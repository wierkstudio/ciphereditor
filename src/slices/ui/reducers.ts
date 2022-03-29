
import { ModalType, UIState } from './types'

export const pushAddModal = (state: UIState): void => {
  state.modalStack.push({
    type: ModalType.Add,
    cancelable: true
  })
}

export const popModal = (state: UIState): void => {
  state.modalStack.splice(state.modalStack.length - 1, 1)
}
