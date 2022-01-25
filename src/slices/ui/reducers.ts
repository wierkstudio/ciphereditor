
import { ModalType, UIState } from './types'

export const pushAddModal = (state: UIState) => {
  state.modalStack.push({
    type: ModalType.Add,
    cancelable: true,
  })
}

export const popModal = (state: UIState) => {
  state.modalStack.splice(state.modalStack.length - 1, 1)
}
