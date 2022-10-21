
import { controlVisibilitySchema } from '../control/schema'
import { rectSchema } from '../common/schema'
import { serializedValueSchema } from '../value/schema'
import { z } from 'zod'

/**
 * Serialized operation node
 */
export type OperationNode = z.infer<typeof operationNodeSchema>
export const operationNodeSchema = z.object({
  type: z.literal('operation'),
  name: z.string(),
  extensionUrl: z.string().optional(),
  priorityControlNames: z.array(z.string()).optional(),
  controls: z.record(z.string(), z.object({
    id: z.string().optional(),
    value: serializedValueSchema.optional(),
    visibility: controlVisibilitySchema.optional()
  })).optional(),
  frame: rectSchema
})
