
/**
 * UI state
 */
export interface UIState {
  modalStack: ModalState[]
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
