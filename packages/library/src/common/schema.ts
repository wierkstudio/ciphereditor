
import { z } from 'zod'

/**
 * Serialized rect object
 */
export type Rect = z.infer<typeof rectSchema>
export const rectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number()
})
