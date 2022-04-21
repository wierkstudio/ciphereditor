
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'

/**
 * UI state
 */
export interface UIState {
  canvasState: UICanvasState
  canvasOffsetX: number
  canvasOffsetY: number
  canvasWidth: number
  canvasHeight: number

  wireDraft?: UIWireDraft

  modalStack: ModalState[]
}

/**
 * Canvas states
 */
export enum UICanvasState {
  Idle,
  Hand,
  Move,
  Wire,
  Drop,
  Modal,
}

/**
 * Wire draft
 */
export interface UIWireDraft {
  sourceControlId: BlueprintNodeId
  targetViewportPosition?: { x: number, y: number }
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
