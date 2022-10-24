
import { z } from 'zod'

/**
 * Serialized point object
 */
export type Point = z.infer<typeof pointSchema>
export const pointSchema = z.object({
  x: z.number(),
  y: z.number()
})

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
