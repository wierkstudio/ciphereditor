
import { ModalState, UICanvasState, UIState, UIWireDraft } from './types'

export const getCanvasState = (state: UIState): UICanvasState =>
  state.canvasState

export const getCanvasOffset = (state: UIState): { x: number, y: number } =>
  ({ x: state.canvasOffsetX, y: state.canvasOffsetY })

export const getCanvasSize = (state: UIState): { width: number, height: number } =>
  ({ width: state.canvasWidth, height: state.canvasHeight })

export const getWireDraft = (state: UIState): UIWireDraft | undefined =>
  state.wireDraft

export const getModalStack = (state: UIState): ModalState[] =>
  state.modalStack

export const isModalStackEmpty = (state: UIState): boolean =>
  state.modalStack.length === 0
