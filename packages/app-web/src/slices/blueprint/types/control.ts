
import { BlueprintNodeState, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { ControlVisibility, SerializedValue } from '@ciphereditor/library'

/**
 * Control node within the blueprint state
 */
export interface ControlNodeState extends BlueprintNodeState {
  /**
   * Node type
   */
  type: BlueprintNodeType.Control

  /**
   * Control name unique within the enclosing operation or program
   */
  name: string

  /**
   * Control label
   */
  label: string

  /**
   * Control description
   */
  description: string | undefined

  /**
   * Accepted control value types
   */
  types: string[]

  /**
   * Initial control value
   */
  initialValue?: SerializedValue

  /**
   * Current value
   */
  value: SerializedValue

  /**
   * Index of the currently selected option
   */
  selectedOptionIndex?: number

  /**
   * Control option values
   */
  options: Array<{ value: SerializedValue, label?: string }>

  /**
   * Wether the value is restricted to control options (if not empty)
   */
  enforceOptions: boolean

  /**
   * Wether a new value can be set from outside the enclosing operation or program
   */
  writable: boolean

  /**
   * Wether to mask the preview of this control (e.g. passwords)
   */
  maskPreview: boolean

  /**
   * Control visibility
   */
  visibility: ControlVisibility

  /**
   * The order number by which controls are ordered within their parent in
   * ascending order. Order numbers 1000 or larger are placed below the header.
   */
  order: number

  /**
   * Name of program/operation extern variable node attached to this control
   */
  attachedVariableId?: BlueprintNodeId

  /**
   * Name of program intern variable node attached to this program control
   */
  attachedInternVariableId?: BlueprintNodeId

  /**
   * Number of pixels between the left side of the node and the outlet
   */
  nodeOutletX?: number

  /**
   * Number of pixels between the top side of the node and the outlet
   */
  nodeOutletY?: number
}

/**
 * Changes that can be applied to a control node
 */
export interface ControlNodeChange {
  /**
   * Id of the node the change originates from, needed for propagation
   */
  sourceNodeId: BlueprintNodeId

  /**
   * New value, if changing
   */
  value?: SerializedValue
}
