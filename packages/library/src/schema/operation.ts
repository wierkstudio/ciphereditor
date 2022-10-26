
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
  name: z.string(),
  extensionUrl: z.string().optional(),
  priorityControlNames: z.array(z.string()).optional(),
  controls: z.record(z.string(), z.object({
    id: z.string().optional(),
    value: serializedValueSchema.optional(),
    visibility: controlVisibilitySchema.optional()
  })).optional(),
  frame: rectSchema.optional()
})
