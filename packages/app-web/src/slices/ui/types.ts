
import { BlueprintNodeId } from '../blueprint/types/blueprint'

/**
 * UI state
 */
export interface UIState {
  /**
   * Frame embed type
   *
   * Possible types:
   * - `standalone` - The web app is not embedded
   * - `website` - The web app is embedded within the official website
   * - `electron` - The web app is embedded within the Electron-based desktop app
   * - `embed` - The web app is embedded within a third-party website
   */
  embedType: 'standalone' | 'website' | 'electron' | 'embed'

  embedEnv: string
  embedMaximizable: boolean
  embedMaximized: boolean

  shareBaseUrl: string

  /**
   * Canvas state
   *
   * Possible states:
   * - `idle` - Idle
   * - `wire` - User is creating a wire
   * - `modal` - At least one modal is shown on top of the canvas
   */
  canvasState: 'idle' | 'wire' | 'modal'

  wireDraft?: UIWireDraft

  modalStack: ModalPayload[]
}

/**
 * Wire draft
 */
export interface UIWireDraft {
  sourceControlId: BlueprintNodeId
  targetControlId?: BlueprintNodeId
}

/**
 * Add modal state
 */
export interface AddModalPayload {
  type: 'add'
}

/**
 * Settings modal state
 */
export interface SettingsModalPayload {
  type: 'settings'
}

/**
 * Report modal state
 */
export interface ReportModalPayload {
  type: 'report'
  title: string
  description: string
}

/**
 * Operation modal state
 */
export interface OperationModalPayload {
  type: 'operation'
  nodeId: BlueprintNodeId
}

/**
 * Save modal state
 */
export interface SaveModalPayload {
  type: 'save'
}

export type ModalPayload =
  AddModalPayload |
  OperationModalPayload |
  ReportModalPayload |
  SettingsModalPayload |
  SaveModalPayload
