
import { ImplicitTypedValue, TypedValue } from '../types/value'
import { arrayEqual } from 'utils/array'
import { capitalCase } from 'change-case'

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
 * Return the label for the given type.
 */
export const labelType = (type: string) => {
  return capitalCase(type)
}

/**
 * Default value used e.g. as initial value in user-defined controls.
 */
export const defaultValue = { value: '', type: 'text' }

/**
 * Return wether a type is within the given types.
 */
export const isTypeWithinTypes = (type: string, withinTypes: string[]) => {
  return undefined !== withinTypes.find(isTypeWithinType.bind(null, type))
}

/**
 * Return wether a type is within the given type.
 */
export const isTypeWithinType = (type: string, withinType: string) => {
  return type === withinType
}

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
      return { value, type: Number.isInteger(value) ? 'integer' : 'number' }
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

/**
 * Convert the given value to a string (e.g. for preview, coping to clipboard).
 */
export const stringifyValue = (value: TypedValue): string => {
  switch (value.type) {
    case 'boolean':
      return (value.value as boolean) ? 'True' : 'False'
    case 'integer':
      return (value.value as number).toString()
    case 'number':
      return (value.value as number).toString()
    case 'bigint':
      return (value.value as bigint).toString()
    case 'text':
      return (value.value as string)
    case 'bytes':
      // TODO: Needs implementation
      return ''
    default:
      return ''
  }
}

/**
 * Compose a preview string for the given value.
 * Return undefined, if no preview is available.
 */
export const previewValue = (value: TypedValue): string => {
  return stringifyValue(value).substring(0, 30)
}
