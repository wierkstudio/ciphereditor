
import {
  ModalPayload,
  UICanvasMode,
  UICanvasState,
  UIEmbedType,
  UIState,
  UIWireDraft
} from './types'

export const getEmbedType = (state: UIState): UIEmbedType =>
  state.embedType

export const getEmbedEnv = (state: UIState): string =>
  state.embedEnv

export const isEmbedMaximizable = (state: UIState): boolean =>
  state.embedMaximizable

export const isEmbedMaximized = (state: UIState): boolean =>
  state.embedMaximized

export const getCanvasMode = (state: UIState): UICanvasMode =>
  state.canvasMode

export const getCanvasState = (state: UIState): UICanvasState =>
  state.canvasState

export const getCanvasOffset = (state: UIState): { x: number, y: number } => {
  if (state.canvasMode === UICanvasMode.Plane) {
    return { x: state.canvasOffsetX, y: state.canvasOffsetY }
  } else {
    // TODO: Evacuate magic numbers (320px is the width of a node)
    return { x: -(state.canvasWidth * 0.5 - 320 * 0.5), y: 0 }
  }
}

export const getCanvasSize = (state: UIState): { width: number, height: number } =>
  ({ width: state.canvasWidth, height: state.canvasHeight })

export const getWireDraft = (state: UIState): UIWireDraft | undefined =>
  state.wireDraft

export const getModalStack = (state: UIState): ModalPayload[] =>
  state.modalStack

export const isModalStackEmpty = (state: UIState): boolean =>
  state.modalStack.length === 0
