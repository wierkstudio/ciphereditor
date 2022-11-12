
import { BlueprintNodeId } from '../blueprint/types/blueprint'

/**
 * UI state
 */
export interface UIState {
  embedType: UIEmbedType
  embedEnv: string
  embedMaximizable: boolean
  embedMaximized: boolean

  shareBaseUrl: string

  canvasState: UICanvasState

  wireDraft?: UIWireDraft

  modalStack: ModalPayload[]
}

/**
 * Frame embed types
 */
export enum UIEmbedType {
  /**
   * The web app is not embedded
   */
  Standalone = 'standalone',

  /**
   * The web app is embedded within the official website
   */
  Website = 'website',

  /**
   * The web app is embedded within the Electron-based desktop app
   */
  Electron = 'electron',

  /**
   * The web app is embedded within a third-party website
   */
  Embed = 'embed'
}

/**
 * Canvas states
 */
export enum UICanvasState {
  Idle = 'idle',
  Wire = 'wire',
  Modal = 'modal'
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
 * Share modal state
 */
export interface ShareModalPayload {
  type: 'share'
}

export type ModalPayload =
  AddModalPayload |
  OperationModalPayload |
  ReportModalPayload |
  SettingsModalPayload |
  ShareModalPayload
