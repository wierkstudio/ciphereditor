
import z from 'zod'

/**
 * Values used within (operation) extensions. They are designed to be as
 * accessible and easy to use as possible (e.g. without decoding first).
 *
 * Design assumptions:
 * - Must be supported by the Structured Clone Algorithm (postMessage API)
 */
export type Value = z.infer<typeof valueSchema>
export const valueSchema = z.union([
  /** Text value */
  z.string(),
  /** Number value */
  z.number(),
  /** Boolean value */
  z.boolean(),
  /** Bytes value */
  z.instanceof(ArrayBuffer),
  /** BigInt value */
  z.bigint()
  // Future types may be composed using objects (see SerializedValue)
  // z.object({
  //   type: z.literal('document'),
  //   data: z.string().describe('Base64 encoded data')
  // })
])

/**
 * Values used within blueprint documents
 *
 * Design assumptions:
 * - Must be JSON serializable
 * - Should work well with Redux state
 */
export type SerializedValue = z.infer<typeof serializedValueSchema>
export const serializedValueSchema = z.union([
  /** Text value */
  z.string(),
  /** Number value */
  z.number(),
  /** Boolean value */
  z.boolean(),
  /** Bytes value */
  z.object({
    type: z.literal('bytes'),
    data: z.string().describe('Base64 encoded data')
  }),
  /** BigInt value */
  z.object({
    type: z.literal('bigint'),
    data: z.string().describe('Stringified BigInt')
  })
])
