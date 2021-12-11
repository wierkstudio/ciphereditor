
import { ImplicitTypedValue, TypedValue } from 'types/value'
import { arrayEqual } from 'utils/array'

/**
 * Complete set of all available value types.
 */
export const allValueTypes = [
  'boolean',
  'integer',
  'number',
  'bigint',
  'text',
  'bytes',
]

/**
 * Default value used e.g. as initial value in user-defined controls.
 */
export const defaultValue = { value: '', type: 'text' }

/**
 * Resolve an implicitly typed value to a typed value following set rules.
 * @throws If an unexpected value is encountered.
 * @param value ImplicitTypedValue value
 * @returns TypedValue object representing the same value
 */
export const resolveImplicitTypedValue = (
  value: ImplicitTypedValue
): TypedValue => {
  if (value instanceof Uint8Array) {
    return { value, type: 'bytes' }
  }
  switch (typeof value) {
    case 'object':
      return value as TypedValue
    case 'boolean':
      return { value, type: 'boolean' }
    case 'number':
      return { value, type: 'number' }
    case 'bigint':
      return { value, type: 'bigint' }
    case 'string':
      return { value, type: 'text' }
    default:
      throw new Error(`Unable to resolve the implicit value type '${typeof value}'`)
  }
}

/**
 * Create a valid empty value of the given type.
 */
export const createValue = (type: string): TypedValue => {
  let value: any
  switch (type) {
    case 'boolean':
      value = false
      break
    case 'integer':
    case 'number':
      value = 0
      break
    case 'bigint':
      value = BigInt(0)
      break
    case 'text':
      value = ''
      break
    case 'bytes':
      value = new Uint8Array()
      break
    default:
      throw new Error(`No empty value defined for type '${type}'`)
  }
  return { value, type }
}

/**
 * Check wether two values are considered equal
 */
export const compareValues = (a: TypedValue, b: TypedValue): boolean => {
  if (a === b) {
    return true
  }
  if (a.type !== b.type) {
    return false
  }
  switch (a.type) {
    case 'boolean':
    case 'integer':
    case 'number':
    case 'bigint':
    case 'text':
      return a.value === b.value
    case 'bytes':
      return arrayEqual(a, b)
    default:
      // Equality for values of the given type is not defined
      return false
  }
}

/**
 * Cast a value to the given type.
 * Returns undefined, if no implicit conversion is available.
 */
export const castValue = (
  value: TypedValue,
  type: string,
): TypedValue | undefined => {
  if (value.type === type) {
    return value
  }
  // TODO: Needs implementation
  return undefined
}
