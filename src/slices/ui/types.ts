
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'

/**
 * UI state
 */
export interface UIState {
  embedType: UIEmbedType
  embedMaximized: boolean

  canvasState: UICanvasState
  canvasOffsetX: number
  canvasOffsetY: number
  canvasWidth: number
  canvasHeight: number

  wireDraft?: UIWireDraft

  modalStack: ModalState[]
}

/**
 * Frame embed types
 */
export enum UIEmbedType {
  /**
   * The app is not embedded
   */
  Standalone = 'standalone',

  /**
   * The app is embedded within the platform
   */
  Platform = 'platform',

  /**
   * The app is embedded within a third-party website
   */
  Embed = 'embed'
}

/**
 * Canvas states
 */
export enum UICanvasState {
  Idle = 'idle',
  Wire = 'wire',
  Modal = 'modal',
}

/**
 * Wire draft
 */
export interface UIWireDraft {
  sourceControlId: BlueprintNodeId
  targetControlId?: BlueprintNodeId
}

/**
 * Modal types
 */
export enum ModalType {
  Add = 'add',
  Settings = 'settings'
}

/**
 * Generic modal state
 */
export interface ModalState {
  type: ModalType
  cancelable: boolean
}

/**
 * Add modal state
 */
export interface AddModalState extends ModalState {
  type: ModalType.Add
  search: string
}
