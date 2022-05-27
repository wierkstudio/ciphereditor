
import { ModalType, UIState } from './types'

export const pushAddModal = (state: UIState): void => {
  state.modalStack.push({
    type: ModalType.Add,
    cancelable: true
  })
}

export const pushSettingsModal = (state: UIState): void => {
  state.modalStack.push({
    type: ModalType.Settings,
    cancelable: true
  })
}

export const pushReportModal = (
  state: UIState,
  title: string,
  description: string
): void => {
  state.modalStack.push({
    type: ModalType.Report,
    cancelable: true,
    title,
    description
  })
}

export const popModal = (state: UIState): void => {
  state.modalStack.splice(state.modalStack.length - 1, 1)
}
