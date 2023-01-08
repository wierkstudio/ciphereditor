
import { controlVisibilitySchema } from '../schema/control'
import { rectSchema } from './2d'
import { serializedValueSchema } from '../schema/value'
import { z } from 'zod'

/**
 * Serialized operation node
 */
export type OperationNode = z.infer<typeof operationNodeSchema>
export const operationNodeSchema = z.object({
  type: z.literal('operation'),

  /**
   * Name uniquely identifying the operation contribution
   */
  name: z.string(),

  /**
   * Alias label of the operation
   */
  label: z.string().optional(),

  /**
   * Url of the extension that includes the operation contribution
   */
  extensionUrl: z.string().optional(),

  /**
   * Array of control node names ordered by priority (highest to lowest)
   */
  priorityControlNames: z.array(z.string()).optional(),

  /**
   * Operation control overrides
   */
  controls: z.record(z.string(), z.object({
    id: z.string().optional(),
    value: serializedValueSchema.optional(),
    visibility: controlVisibilitySchema.optional()
  })).optional(),

  /**
   * Wether the operation should be executed after being added to the blueprint
   * Defaults to false
   */
  initialExecution: z.boolean().optional(),

  /**
   * Position and size of the operation node
   */
  frame: rectSchema.optional()
})
