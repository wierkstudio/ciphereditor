
import { z } from 'zod'

/**
 * Point object
 */
export type Point = z.infer<typeof pointSchema>
export const pointSchema = z.object({
  x: z.number(),
  y: z.number()
})

/**
 * Size object
 */
export type Size = z.infer<typeof sizeSchema>
export const sizeSchema = z.object({
  width: z.number(),
  height: z.number()
})

/**
 * Rect object
 */
export type Rect = z.infer<typeof rectSchema>
export const rectSchema = pointSchema.merge(sizeSchema)
