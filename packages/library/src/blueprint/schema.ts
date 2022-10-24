
import { z } from 'zod'
import { controlNodeSchema } from '../control/schema'
import { operationNodeSchema } from '../operation/schema'
import { programNodeSchema } from '../program/schema'
import { variableNodeSchema } from '../variable/schema'

/**
 * Serialized blueprint document
 */
export type Blueprint = z.infer<typeof blueprintSchema>
export const blueprintSchema = z.object({
  type: z.literal('blueprint'),
  program: programNodeSchema
})

export type BlueprintNode = z.infer<typeof blueprintNodeSchema>
export const blueprintNodeSchema = z.union([
  controlNodeSchema,
  operationNodeSchema,
  programNodeSchema,
  variableNodeSchema
])
