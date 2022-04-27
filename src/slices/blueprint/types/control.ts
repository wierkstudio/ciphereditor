
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { ImplicitTypedValue, TypedValue, implicitTypedValueSchema, labeledImplicitTypedValueSchema, LabeledTypedValue } from './value'
import { z } from 'zod'

export const controlSchema = z.object({
  /**
   * Control name unique within the enclosing operation or program
   */
  name: z.string(),

  /**
   * Control label
   */
  label: z.string().optional(),

  /**
   * Accepted control value types
   */
  types: z.array(z.string()),

  /**
   * Initial control value
   */
  initialValue: implicitTypedValueSchema,

  /**
   * Control value choices
   * Defaults to an empty array
   */
  choices: z.array(labeledImplicitTypedValueSchema).optional(),

  /**
   * Wether the value is restricted to the given options (if not empty)
   * Defaults to true
   */
  enforceChoices: z.boolean().optional(),

  /**
   * Control enabled state
   * Defaults to true
   */
  enabled: z.boolean().optional(),

  /**
   * Wether a new value can be set from outside the enclosing operation or program
   * Defaults to true
   */
  writable: z.boolean().optional(),

  /**
   * The order number by which controls are ordered within their parent in
   * ascending order. Order numbers 1000 or larger are placed below the header.
   */
  order: z.number().optional()
})

/**
 * Control entity
 * Controls are the building blocks of operation and program interfaces.
 */
export type Control = z.infer<typeof controlSchema>

export const controlChangeSchema = z.object({
  label: z.string().optional(),
  value: implicitTypedValueSchema.optional(),
  choices: z.array(labeledImplicitTypedValueSchema).optional(),
  enabled: z.boolean().optional(),
  order: z.number().optional()
})

/**
 * Structured changes targeted to a control node
 */
export type ControlChange = z.infer<typeof controlChangeSchema>

export const namedControlChangesSchema = z.array(
  controlChangeSchema.extend({
    name: z.string()
  })
)

/**
 * Set of structured changes targeted to named control nodes
 */
export type NamedControlChanges = z.infer<typeof namedControlChangesSchema>

/**
 * Control change source
 */
export enum ControlChangeSource {
  Parent,
  UserInput,
  Variable,
}

/**
 * Control view state
 */
export enum ControlViewState {
  Collapsed,
  Expanded,
  Hidden,
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
  initialValue?: ImplicitTypedValue

  /**
   * Current value
   */
  value: TypedValue

  /**
   * Index of the currently selected choice
   */
  selectedChoiceIndex?: number

  /**
   * Control value choices
   */
  choices: LabeledTypedValue[]

  /**
   * Wether the value is restricted to control choices (if not empty)
   */
  enforceChoices: boolean

  /**
   * Control view state
   */
  viewState: ControlViewState

  /**
   * Control enabled state
   */
  enabled: boolean

  /**
   * Wether a new value can be set from outside the enclosing operation or program
   */
  writable: boolean

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
