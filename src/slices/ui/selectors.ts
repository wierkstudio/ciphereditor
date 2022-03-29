
import { ModalState, UIState } from './types'

export const getCanvasPosition = (state: UIState): { x: number, y: number } =>
  ({ x: state.canvasX, y: state.canvasY })

export const getModalStack = (state: UIState): ModalState[] =>
  state.modalStack

export const isModalStackEmpty = (state: UIState): boolean =>
  state.modalStack.length === 0
