
/**
 * UI state
 */
export interface UIState {
  canvasState: UICanvasState
  canvasX: number
  canvasY: number
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
 * Modal types
 */
export enum ModalType {
  Add = 'add',
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
