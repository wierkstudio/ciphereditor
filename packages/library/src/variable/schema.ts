
import { z } from 'zod'

export type VariableNode = z.infer<typeof variableNodeSchema>
export const variableNodeSchema = z.object({
  type: z.literal('variable'),

  /**
   * References to nodes in the same tree that are attached to this variable
   */
  attachments: z.array(z.string()).min(2)
})
