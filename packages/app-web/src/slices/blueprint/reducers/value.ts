
import { ImplicitTypedValue, LabeledImplicitTypedValue, TypedValue } from '@ciphereditor/types'
import { LabeledTypedValue } from '../types/value'
import { arrayEqual } from 'utils/array'
import { bufferToHexString } from 'utils/binary'
import { capitalCase } from 'change-case'

/**
 * Complete set of all available value types.
 */
export const allValueTypes = [
  'boolean',
  'integer',
  'number',
  'text',
  'bytes'
]

/**
 * Return the label for the given type.
 */
export const labelType = (type: string): string => {
  return capitalCase(type)
}

/**
 * Default value used e.g. as initial value in user-defined controls.
 */
export const defaultValue: TypedValue = { type: 'text', data: '' }

/**
 * Return wether a type is within the given types.
 */
export const isTypeWithinTypes = (type: string, withinTypes: string[]): boolean => {
  return undefined !== withinTypes.find(isTypeWithinType.bind(null, type))
}

/**
 * Return wether a type is within the given type.
 */
export const isTypeWithinType = (type: string, withinType: string): boolean => {
  return type === withinType
}

/**
 * Resolve an implicitly typed value to a typed value following set rules.
 * @throws If an unexpected value is encountered.
 * @returns TypedValue object representing the same value
 */
export const resolveImplicitTypedValue = (
  implicitValue: ImplicitTypedValue
): TypedValue => {
  if (implicitValue instanceof ArrayBuffer) {
    return { type: 'bytes', data: implicitValue }
  }
  switch (typeof implicitValue) {
    case 'object':
      return implicitValue
    case 'boolean':
      return { type: 'boolean', data: implicitValue }
    case 'number':
      return {
        type: Number.isInteger(implicitValue) ? 'integer' : 'number',
        data: implicitValue
      }
    case 'string':
      return { type: 'text', data: implicitValue }
    default:
      throw new Error(`Unable to resolve an implicit value of type '${typeof implicitValue}'`)
  }
}

/**
 * Resolve labeled and implicit typed value
 * @throws If an unexpected value is encountered.
 * @returns LabeledTypedValue object representing the same labeled value
 */
export const resolveLabeledImplicitTypedValue = (
  labeledImplicitTypedValue: LabeledImplicitTypedValue
): LabeledTypedValue => {
  return {
    label: labeledImplicitTypedValue.label,
    value: resolveImplicitTypedValue(labeledImplicitTypedValue.value)
  }
}

/**
 * Create a valid empty value of the given type.
 */
export const createValue = (type: string): TypedValue => {
  let data: any
  switch (type) {
    case 'boolean':
      data = false
      break
    case 'integer':
    case 'number':
      data = 0
      break
    case 'text':
      data = ''
      break
    case 'bytes':
      data = new ArrayBuffer(0)
      break
    default:
      throw new Error(`No empty value defined for type '${type}'`)
  }
  return { type, data }
}

/**
 * Check wether two values are considered equal
 */
export const equalValues = (a: TypedValue, b: TypedValue): boolean => {
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
    case 'text':
      return a.data === b.data
    case 'bytes':
      return arrayEqual(
        new Uint8Array(a.data),
        new Uint8Array(b.data as ArrayBuffer)
      )
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
  type: string
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
      return value.data ? 'True' : 'False'
    case 'integer':
      return value.data.toString()
    case 'number':
      return value.data.toString()
    case 'text':
      return value.data
    case 'bytes':
      return bufferToHexString(value.data)
    default:
      // Treat the value not of type never here as we might add additional types
      // without adding a way to stringify it
      return labelType((value as TypedValue).type)
  }
}

/**
 * Compose a preview string for the given value.
 * Return undefined, if no preview is available.
 */
export const previewValue = (value: TypedValue): string => {
  if (value.type === 'bytes') {
    return bufferToHexString(value.data.slice(0, 15))
  }
  return stringifyValue(value).substring(0, 30)
}
