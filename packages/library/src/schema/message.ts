
import { z } from 'zod'
import { blueprintNodeSchema, blueprintSchema } from '../schema/blueprint'

/**
 * Message targeted to the website
 */
export type WebsiteMessage = z.infer<typeof websiteMessageSchema>
export const websiteMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('initiated')
  }),
  z.object({
    type: z.literal('settingsChange'),
    theme: z.enum(['system', 'light', 'dark']),
    reducedMotionPreference: z.enum(['system', 'reduce'])
  }),
  z.object({
    type: z.literal('intrinsicHeightChange'),
    height: z.number()
  }),
  z.object({
    type: z.literal('maximizedChange'),
    maximized: z.boolean()
  }),
  z.object({
    type: z.literal('open'),
    url: z.string()
  })
])

/**
 * Message targeted to the app
 */
export type EditorMessage = z.infer<typeof editorMessageSchema>
export const editorMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('configure'),
    embedType: z.enum(['standalone', 'website', 'electron', 'embed']).optional(),
    maximizable: z.boolean().optional(),
    shareBaseUrl: z.string().optional()
  }),
  z.object({
    type: z.literal('loadBlueprint'),
    blueprint: blueprintSchema
  }),
  z.object({
    type: z.literal('addNodes'),
    nodes: z.array(blueprintNodeSchema)
  })
])
