
/**
 * Explicit typed boolean value
 */
export interface BooleanValue {
  type: 'boolean'
  data: boolean
}

/**
 * Explicit typed integer value
 */
export interface IntegerValue {
  type: 'integer'
  data: number
}

/**
 * Explicit typed number value
 */
export interface NumberValue {
  type: 'number'
  data: number
}

/**
 * Explicit typed text value
 */
export interface TextValue {
  type: 'text'
  data: string
}

/**
 * Explicit typed bytes value
 */
export interface BytesValue {
  type: 'bytes'
  data: ArrayBuffer
}

/**
 * Explicit typed value
 */
export type TypedValue =
  BooleanValue |
  IntegerValue |
  NumberValue |
  TextValue |
  BytesValue

/**
 * Value for which its type is resolved implicitly from the raw value type
 */
export type ImplicitTypedValue =
  TypedValue | boolean | number | string | ArrayBuffer

/**
 * Implicit typed value with a label
 */
export interface LabeledImplicitTypedValue {
  /**
   * Value label
   */
  label: string

  /**
   * Value
   */
  value: ImplicitTypedValue
}

/**
 * Object describing a control.
 * Controls are the building blocks of operation and program interfaces.
 */
export interface Control {
  /**
   * Control name unique within the enclosing operation or program
   */
  name: string

  /**
   * Control label
   * Defaults to the capitalized name of the control
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
   * Control value choices
   * Defaults to an empty array
   */
  choices?: LabeledImplicitTypedValue[]

  /**
   * Wether the value is restricted to the given options (if not empty)
   * Defaults to true
   */
  enforcechoices?: boolean

  /**
   * Control enabled state
   * Defaults to true
   */
  enabled?: boolean

  /**
   * Wether a new value can be set from outside this control's parent
   * Defaults to true
   */
  writable?: boolean

  /**
   * The order number by which controls are ordered within their parent in
   * ascending order. Order numbers 1000 or larger are placed below the header.
   */
  order?: number
}

/**
 * Object describing a set of changes applied to a control with the given name
 */
export interface NamedControlChange {
  name: string
  label?: string
  value?: ImplicitTypedValue
  choices?: LabeledImplicitTypedValue[]
  enabled?: boolean
  order?: number
}

/**
 * An operation result hint is an error, warning or information that occur
 * while processing an operation request.
 */
export interface OperationIssue {
  /**
   * Log level
   */
  type: 'error' | 'warn' | 'info'

  /**
   * Control referenced by name relevant to this issue
   */
  controlName?: string

  /**
   * Issue message
   */
  message: string

  /**
   * Optional issue description going into more detail
   */
  description?: string
}

/**
 * An error that occured while processing an operation request
 */
export type ErrorOperationIssue = OperationIssue & {
  type: 'error'
}

/**
 * Operation execution request
 */
export interface OperationRequest {
  /**
   * The current value for each control
   */
  values: { [controlName: string]: TypedValue }

  /**
   * Array of control names ordered by priority (highest to lowest);
   * Allows the operation to decide on what direction the content flows.
   */
  controlPriorities: string[]
}

/**
 * Operation execution result
 */
export interface OperationResult {
  /**
   * The set of changes to the controls that represent the result
   */
  changes?: NamedControlChange[]

  /**
   * Issues encountered during the execution of the operation
   */
  issues?: OperationIssue[]
}

/**
 * Method resolving an operation request to an operation result
 */
export type OperationExecuteExport =
  (request: OperationRequest) =>
  OperationResult |
  ErrorOperationIssue |
  PromiseLike<OperationResult | ErrorOperationIssue>

/**
 * Abstract contribution interface all contributions extend from
 */
interface AbstractContribution {
  /**
   * Contribution type
   */
  type: string

  /**
   * Unique name the contribution is identified by
   */
  name: string

  /**
   * Url of extension JavaScript bundle containing this contribution
   */
  extensionUrl?: string
}

/**
 * Operation contribution metadata
 */
export interface OperationContribution extends AbstractContribution {
  /**
   * Contribution type
   */
  type: 'operation'

  /**
   * Operation label
   * Defaults to the capitalized name of the operation
   */
  label?: string

  /**
   * Operation description
   */
  description?: string

  /**
   * The url to the contribution website or documentation
   */
  url?: string

  /**
   * Keywords help people discover this contribution through search
   */
  keywords?: string[]

  /**
   * Array of controls
   */
  controls: Control[]
}

/**
 * Operation contribution body
 */
export interface OperationContributionBody {
  execute: OperationExecuteExport
}

/**
 * Operation contribution exports
 */
export interface OperationContributionExports {
  contribution: OperationContribution
  body: OperationContributionBody
}

/**
 * Contribution metadata
 */
export type Contribution =
  OperationContribution

/**
 * Contribution exports
 */
export type ContributionExports =
  OperationContributionExports

/**
 * Extension context (for future use)
 */
export type ExtensionContext = ({})

/**
 * Extension activate function signature
 */
export type ExtensionActivateExport =
  (context: ExtensionContext) => ContributionExports[] | PromiseLike<ContributionExports[]>

/**
 * Represents the module of an extension.
 */
export interface ExtensionExports {
  /**
   * Called when an extension is activated to give the opportunity to register
   * extension contributions.
   */
  activate: ExtensionActivateExport
}
