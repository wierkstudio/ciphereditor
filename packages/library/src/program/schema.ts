
import { ControlNode, controlNodeSchema } from '../control/schema'
import { OperationNode, operationNodeSchema } from '../operation/schema'
import { VariableNode, variableNodeSchema } from '../variable/schema'
import { z } from 'zod'

export interface ProgramNode {
  type: 'program'
  label: string
  children: Array<ControlNode | OperationNode | ProgramNode | VariableNode>
}

export const programNodeSchema: z.ZodType<ProgramNode> = z.lazy(() => z.object({
  type: z.literal('program'),
  label: z.string(),
  children: z.array(z.union([
    controlNodeSchema,
    operationNodeSchema,
    programNodeSchema,
    variableNodeSchema
  ]))
}))
