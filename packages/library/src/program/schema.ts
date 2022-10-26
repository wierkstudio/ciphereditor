
import { ControlNode } from '../control/schema'
import { OperationNode } from '../operation/schema'
import { Point, pointSchema, Rect, rectSchema } from '../common/schema'
import { VariableNode } from '../variable/schema'
import { blueprintNodeSchema } from '../blueprint/schema'
import { z } from 'zod'

export interface ProgramNode {
  type: 'program'
  label?: string
  children?: Array<ControlNode | OperationNode | ProgramNode | VariableNode>
  offset?: Point
  frame?: Rect
}

export const programNodeSchema: z.ZodType<ProgramNode> = z.lazy(() => z.object({
  type: z.literal('program'),
  label: z.string().optional(),
  children: z.array(blueprintNodeSchema).optional(),
  offset: pointSchema.optional(),
  frame: rectSchema.optional()
}))
