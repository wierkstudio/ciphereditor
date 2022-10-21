
import { z } from 'zod'
import { programNodeSchema } from '../program/schema'

/**
 * Serialized blueprint document
 */
export type BlueprintNode = z.infer<typeof blueprintNodeSchema>
export const blueprintNodeSchema = z.object({
  type: z.literal('blueprint'),
  program: programNodeSchema
})
