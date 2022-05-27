
import { BlueprintNode, BlueprintNodeId, BlueprintNodeType } from './blueprint'
import { implicitTypedValueSchema, labeledImplicitTypedValueSchema, LabeledTypedValue } from './value'
import { Control, ImplicitTypedValue, NamedControlChange, TypedValue } from 'cryptii-types'
import { z } from 'zod'

export const controlSchema: z.ZodType<Control> = z.object({
  name: z.string(),
  label: z.string().optional(),
  types: z.array(z.string()),
  initialValue: implicitTypedValueSchema,
  choices: z.array(labeledImplicitTypedValueSchema).optional(),
  enforceChoices: z.boolean().optional(),
  enabled: z.boolean().optional(),
  writable: z.boolean().optional(),
  order: z.number().optional()
})

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

export const namedControlChangeSchema: z.ZodType<NamedControlChange> =
  controlChangeSchema.extend({
    name: z.string()
  })

export const namedControlChangesSchema = z.array(namedControlChangeSchema)
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
