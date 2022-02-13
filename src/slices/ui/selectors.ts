
import { UIState } from './types'

export const getCanvasPosition = (state: UIState) =>
  ({ x: state.canvasX, y: state.canvasY })

export const getModalStack = (state: UIState) =>
  state.modalStack

export const isModalStackEmpty = (state: UIState) =>
  state.modalStack.length === 0
