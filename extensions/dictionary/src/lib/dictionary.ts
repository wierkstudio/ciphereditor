
import { DeepRequired } from 'ts-essentials'
import z from 'zod'

const dictionaryWordSchema = z.union([
  /**
   * Single word token
   */
  z.string(),

  /**
   * Choice of multiple word tokens
   */
  z.array(z.string())
])

export type DictionaryWord = z.infer<typeof dictionaryWordSchema>

const dictionaryElementSchema = z.object({
  /**
   * Dictionary key
   */
  key: dictionaryWordSchema,

  /**
   * Dictionary value
   */
  value: dictionaryWordSchema
})

export type DictionaryElement = z.infer<typeof dictionaryElementSchema>

const wordConfigSchema = z.object({
  /**
   * Whether words should be matched in a case-sensitive way.
   */
  caseSensitive: z.boolean().optional(),

  /**
   * Separator between words
   */
  wordSeparator: z.string().optional(),

  /**
   * How to prioritise one match over another
   * Enum: 'longest', 'first'
   */
  matchStrategy: z.string().optional(),

  /**
   * How a word gets chosen when translating to it
   * Enum: 'first', 'random'
   */
  choiceStrategy: z.string().optional()
})

export type WordConfig = z.infer<typeof wordConfigSchema>

export const defaultWordConfig: DeepRequired<WordConfig> = {
  caseSensitive: true,
  wordSeparator: '',
  matchStrategy: 'longest',
  choiceStrategy: 'first'
}

const dictionaryVariantConfigSchema = z.object({
  /**
   * Dictionary key config
   */
  key: wordConfigSchema.optional(),

  /**
   * Dictionary value config
   */
  value: wordConfigSchema.optional()
})

const dictionaryVariantSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  sources: z.array(z.string()),
  default: z.boolean().optional(),
  config: dictionaryVariantConfigSchema.optional(),
  elements: z.array(dictionaryElementSchema)
})

export type DictionaryVariant = z.infer<typeof dictionaryVariantSchema>

const dictionaryConfigSchema = dictionaryVariantConfigSchema.extend({
  /**
   * Whether the translation from keys to values can be reversed
   * Default: true
   */
  reversible: z.boolean().optional()
})

export type DictionaryConfig = z.infer<typeof dictionaryConfigSchema>

export const defaultConfig: DeepRequired<DictionaryConfig> = {
  reversible: true,
  key: defaultWordConfig,
  value: defaultWordConfig
}

export const dictionarySchema = z.object({
  config: dictionaryConfigSchema.optional(),
  variants: z.array(dictionaryVariantSchema)
})

export type Dictionary = z.infer<typeof dictionarySchema>
