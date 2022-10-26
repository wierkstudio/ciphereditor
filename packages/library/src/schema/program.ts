
import { ControlNode } from '../schema/control'
import { OperationNode } from '../schema/operation'
import { Point, pointSchema, Rect, rectSchema } from './2d'
import { VariableNode } from '../schema/variable'
import { blueprintNodeSchema } from '../schema/blueprint'
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
