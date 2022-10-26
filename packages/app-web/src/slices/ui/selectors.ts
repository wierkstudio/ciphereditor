
import { Point, Rect } from '@ciphereditor/library'
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

export const getCanvasSize = (state: UIState): { width: number, height: number } =>
  state.canvasSize

export const getViewportRect = (state: UIState, offset: Point): Rect => ({
  x: offset.x - state.canvasSize.width * 0.5,
  y: offset.y - state.canvasSize.height * 0.5,
  width: state.canvasSize.width,
  height: state.canvasSize.height
})

export const getWireDraft = (state: UIState): UIWireDraft | undefined =>
  state.wireDraft

export const getModalStack = (state: UIState): ModalPayload[] =>
  state.modalStack

export const isModalStackEmpty = (state: UIState): boolean =>
  state.modalStack.length === 0
