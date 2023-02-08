
import { ModalPayload, UIState, UIWireDraft } from './types'

export const getEmbedType = (state: UIState): UIState['embedType'] =>
  state.embedType

export const getEmbedEnv = (state: UIState): string =>
  state.embedEnv

export const isEmbedMaximizable = (state: UIState): boolean =>
  state.embedMaximizable

export const isEmbedMaximized = (state: UIState): boolean =>
  state.embedMaximized

export const getCanvasState = (state: UIState): UIState['canvasState'] =>
  state.canvasState

export const getWireDraft = (state: UIState): UIWireDraft | undefined =>
  state.wireDraft

export const getModalStack = (state: UIState): ModalPayload[] =>
  state.modalStack

export const isModalStackEmpty = (state: UIState): boolean =>
  state.modalStack.length === 0
