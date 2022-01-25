
import { UIState } from './types'

export const getModalStack = (state: UIState) =>
  state.modalStack

export const isModalStackEmpty = (state: UIState) =>
  state.modalStack.length === 0
