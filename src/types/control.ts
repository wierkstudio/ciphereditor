
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { ImplicitTypedValue, TypedValue } from './value'

/**
 * Control entity
 * Controls are the building blocks of operation and program interfaces.
 */
export interface Control {
  /**
   * Control name unique within the enclosing operation or program
   */
  name: string

  /**
   * Control label
   */
  label?: string

  /**
   * Accepted control value types
   */
  types: string[]

  /**
   * Initial control value
   */
  initialValue: ImplicitTypedValue

  /**
   * Enumeration of named values. Expects a (value, type, label) tuple where
   * type and label are optional.
   * Defaults to empty array (no restriction).
   */
  enum?: [any][] | [any, string][] | [any, string, string][]

  /**
   * Wether the value is restricted to the enum values (if not empty)
   * Defaults to true
   */
  enumStrict?: boolean

  /**
   * Control enabled state
   * Defaults to true
   */
  enabled?: boolean

  /**
   * Wether a new value can be set from outside the enclosing operation or program
   * Defaults to true
   */
  writable?: boolean
}

/**
 * Structured changes targeted to a control node
 */
export interface ControlChange {
  /**
   * New label
   */
  label?: string

  /**
   * New value
   */
  value?: ImplicitTypedValue

  /**
   * New enumeration of named values
   */
  enum?: [any][] | [any, string][] | [any, string, string][]

  /**
   * New enabled state
   */
  enabled?: boolean
}

/**
 * Structured changes targeted to a control node identified by name
 */
export interface NamedControlChange extends ControlChange {
  /**
   * Target control name
   */
  name: string
}

/**
 * Control change source
 */
export enum ControlChangeSource {
  Parent,
  UserInput,
  Variable,
}

/**
 * Control node
 * Controls are the building blocks of operation and program interfaces.
 */
export interface ControlNode extends BlueprintNode {
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
   * Accepted control value types
   */
  types: string[]

  /**
   * Initial control value
   */
  initialValue: ImplicitTypedValue

  /**
   * Current value
   */
  value: TypedValue

  /**
   * Enumeration of named values. Expects a (value, type, label) tuple where
   * type and label are optional.
   */
  enum: [any][] | [any, string][] | [any, string, string][]

  /**
   * Wether the value is restricted to the enum values (if not empty)
   */
  enumStrict: boolean

  /**
   * Control enabled state
   */
  enabled: boolean

  /**
   * Wether a new value can be set from outside the enclosing operation or program
   */
  writable: boolean

  /**
   * Name of program/operation extern variable node attached to this control
   */
  attachedVariableId?: BlueprintNodeId

  /**
   * Name of program intern variable node attached to this program control
   */
  attachedInternVariableId?: BlueprintNodeId
}
