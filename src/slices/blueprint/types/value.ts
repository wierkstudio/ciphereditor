
import { z } from 'zod'

export const booleanValueSchema = z.object({
  type: z.literal('boolean'),
  data: z.boolean()
})

export type BooleanValue = z.infer<typeof booleanValueSchema>

export const integerValueSchema = z.object({
  type: z.literal('integer'),
  data: z.number().int()
})

export type IntegerValue = z.infer<typeof integerValueSchema>

export const numberValueSchema = z.object({
  type: z.literal('number'),
  data: z.number()
})

export type NumberValue = z.infer<typeof numberValueSchema>

export const textValueSchema = z.object({
  type: z.literal('text'),
  data: z.string()
})

export type TextValue = z.infer<typeof textValueSchema>

export const bytesValueSchema = z.object({
  type: z.literal('bytes'),
  data: z.instanceof(Uint8Array)
})

export type BytesValue = z.infer<typeof bytesValueSchema>

export const typedValueSchema = z.union([
  booleanValueSchema,
  integerValueSchema,
  numberValueSchema,
  textValueSchema,
  bytesValueSchema
])

/**
 * Value having an explicit type attached
 */
export type TypedValue = z.infer<typeof typedValueSchema>

export const implicitTypedValueSchema = z.union([
  typedValueSchema,
  z.boolean(),
  z.number(),
  z.string(),
  z.instanceof(Uint8Array)
])

/**
 * Value for which its type is resolved implicitly from the raw value type
 */
export type ImplicitTypedValue = z.infer<typeof implicitTypedValueSchema>

export const labeledTypedValueSchema = z.object({
  label: z.string(),
  value: typedValueSchema
})

export type LabeledTypedValue = z.infer<typeof labeledTypedValueSchema>

export const labeledImplicitTypedValueSchema = z.object({
  label: z.string(),
  value: implicitTypedValueSchema
})

export type LabeledImplicitTypedValue = z.infer<typeof labeledImplicitTypedValueSchema>
