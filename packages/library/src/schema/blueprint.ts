
import { controlNodeSchema } from '../schema/control'
import { operationNodeSchema } from '../schema/operation'
import { programNodeSchema } from '../schema/program'
import { variableNodeSchema } from '../schema/variable'
import { z } from 'zod'

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
