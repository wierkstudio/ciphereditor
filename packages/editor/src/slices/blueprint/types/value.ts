
import {
  BooleanValue,
  BytesValue,
  ImplicitTypedValue,
  IntegerValue,
  LabeledImplicitTypedValue,
  NumberValue,
  TextValue,
  TypedValue
} from '@cryptii/types'
import { z } from 'zod'

export const booleanValueSchema: z.ZodType<BooleanValue> = z.object({
  type: z.literal('boolean'),
  data: z.boolean()
})

export const integerValueSchema: z.ZodType<IntegerValue> = z.object({
  type: z.literal('integer'),
  data: z.number().int()
})

export const numberValueSchema: z.ZodType<NumberValue> = z.object({
  type: z.literal('number'),
  data: z.number()
})

export const textValueSchema: z.ZodType<TextValue> = z.object({
  type: z.literal('text'),
  data: z.string()
})

export const bytesValueSchema: z.ZodType<BytesValue> = z.object({
  type: z.literal('bytes'),
  data: z.instanceof(ArrayBuffer)
})

export const typedValueSchema: z.ZodType<TypedValue> = z.union([
  booleanValueSchema,
  integerValueSchema,
  numberValueSchema,
  textValueSchema,
  bytesValueSchema
])

export const implicitTypedValueSchema: z.ZodType<ImplicitTypedValue> = z.union([
  typedValueSchema,
  z.boolean(),
  z.number(),
  z.string(),
  z.instanceof(ArrayBuffer)
])

export const labeledTypedValueSchema = z.object({
  label: z.string(),
  value: typedValueSchema
})

export type LabeledTypedValue = z.infer<typeof labeledTypedValueSchema>

export const labeledImplicitTypedValueSchema: z.ZodType<LabeledImplicitTypedValue> = z.object({
  label: z.string(),
  value: implicitTypedValueSchema
})
