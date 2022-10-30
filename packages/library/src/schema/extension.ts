
import z from 'zod'
import { controlChangeSchema, controlSchema } from '../schema/control'
import { operationIssueSchema } from '../schema/issue'
import { valueSchema } from '../schema/value'

/**
 * Operation contribution entity
 */
export type OperationContribution = z.infer<typeof operationContributionSchema>
export const operationContributionSchema = z.object({
  /**
   * Contribution type
   */
  type: z.literal('operation'),

  /**
   * Name that uniquely identifies the operation on earth
   */
  name: z.string(),

  /**
   * Url of extension JavaScript bundle providing this contribution
   */
  extensionUrl: z.string().optional(),

  /**
   * Operation label
   * Defaults to the capitalized name of the operation
   */
  label: z.string().optional(),

  /**
   * Operation description
   */
  description: z.string().optional(),

  /**
   * The url to the contribution website or documentation
   */
  url: z.string().optional(),

  /**
   * Keywords help people discover the contribution through search
   */
  keywords: z.array(z.string()).optional(),

  /**
   * Wether the same inputs always return the same output
   * Defaults to true
   */
  reproducible: z.boolean().optional(),

  /**
   * Array of controls
   */
  controls: z.array(controlSchema),

  /**
   * Execution timeout (in ms)
   * Defaults to 10 seconds, limited to 5 minutes
   */
  timeout: z.number().optional()
})

/**
 * Abstract contribution interface all contributions extend from
 * This will eventually become a union type in the future.
 */
export type Contribution = z.infer<typeof contributionSchema>
export const contributionSchema = operationContributionSchema

/**
 * Object sent as an argument with every operation execution request
 */
export type OperationRequest = z.infer<typeof operationRequestSchema>
export const operationRequestSchema = z.object({
  /**
   * The current value for each control
   */
  values: z.record(valueSchema),

  /**
   * Array of control names ordered by priority (highest to lowest);
   * Allows the operation to decide on what direction the content flows.
   */
  controlPriorities: z.array(z.string())
})

/**
 * Return value of the operation execution function
 */
export type OperationResult = z.infer<typeof operationResultSchema>
export const operationResultSchema = z.object({
  /**
   * Set of control changes that represent the operation execution result
   */
  changes: z.array(controlChangeSchema).optional(),

  /**
   * Issues encountered during the execution of the operation
   */
  issues: z.array(operationIssueSchema).optional()
}).strict()

/**
 * Will be called when an operation execution is requested
 */
export type OperationExecuteExport = z.infer<typeof operationExecuteExportSchema>
export const operationExecuteExportSchema = z.function()
  .args(operationRequestSchema)
  .returns(z.union([
    z.promise(operationResultSchema),
    operationResultSchema
  ]))

/**
 * Methods expected to be exported by operation contributions
 */
export type OperationContributionBody = z.infer<typeof operationContributionBodySchema>
export const operationContributionBodySchema = z.object({
  execute: operationExecuteExportSchema
})

/**
 * Exports expected by an operation contribution
 */
export type OperationContributionExports = z.infer<typeof operationContributionExportsSchema>
export const operationContributionExportsSchema = z.object({
  contribution: operationContributionSchema,
  body: operationContributionBodySchema
})

/**
 * This will eventually become a union type in the future.
 */
export type ContributionExports = z.infer<typeof contributionExportsSchema>
export const contributionExportsSchema = operationContributionExportsSchema

/**
 * The extension context object offers API endpoints to the extension.
 * Reserved for future use.
 */
export type ExtensionContext = z.infer<typeof extensionContextSchema>
export const extensionContextSchema = z.object({})

/**
 * Called after an extension has been loaded to give it the opportunity to
 * register extension contributions.
 */
export type ExtensionActivateExport = z.infer<typeof extensionActivateExportSchema>
export const extensionActivateExportSchema =
  z.function()
    .args(extensionContextSchema)
    .returns(z.union([
      z.array(contributionExportsSchema),
      z.promise(z.array(contributionExportsSchema))
    ]))

/**
 * Exports expected from an extension
 */
export type ExtensionExports = z.infer<typeof extensionExportsSchema>
export const extensionExportsSchema = z.object({
  activate: extensionActivateExportSchema
})
