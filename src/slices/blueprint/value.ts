
import { ImplicitTypedValue, TypedValue } from '../../types/value'

/**
 * Resolve an implicitly typed value to a typed value following set rules.
 * @throws If an unexpected value is encountered.
 * @param value ImplicitTypedValue value
 * @returns TypedValue object representing the same value
 */
export const resolveImplicitTypedValue = (value: ImplicitTypedValue): TypedValue => {
  if (value instanceof Uint8Array) {
    return { value, type: 'bytes' }
  }
  switch (typeof value) {
    case 'object':
      return value as TypedValue
    case 'string':
      return { value, type: 'text' }
    case 'boolean':
      return { value, type: 'boolean' }
    case 'number':
      return { value, type: 'double' }
    case 'bigint':
      return { value, type: 'bigint' }
    default:
      throw new Error(`Unable to resolve the implicit value type '${typeof value}'`)
  }
}
