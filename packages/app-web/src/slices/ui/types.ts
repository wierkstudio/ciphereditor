
import { BlueprintNodeId } from '../blueprint/types/blueprint'

/**
 * UI state
 */
export interface UIState {
  embedType: UIEmbedType
  embedEnv: string
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
   * The web app is not embedded
   */
  Standalone = 'standalone',

  /**
   * The web app is embedded within the platform
   */
  Platform = 'platform',

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
 * Modal types
 */
export enum ModalType {
  Add = 'add',
  Settings = 'settings',
  Report = 'report'
}

/**
 * Generic modal state
 */
interface AbstractModalState {
  type: ModalType
  cancelable: boolean
}

/**
 * Add modal state
 */
export interface AddModalState extends AbstractModalState {
  type: ModalType.Add
}

/**
 * Settings modal state
 */
export interface SettingsModalState extends AbstractModalState {
  type: ModalType.Settings
}

/**
 * Report modal state
 */
export interface ReportModalState extends AbstractModalState {
  type: ModalType.Report
  title: string
  description: string
}

export type ModalState = AddModalState | SettingsModalState | ReportModalState
