
import { SerializedValue, Value } from './schema'
import { base64StringToBuffer, bufferToBase64String, bufferToHexString, bufferToString, stringToBuffer } from '../lib/binary'
import { labelType } from './type'

/**
 * Extract a value from the given serialized value.
 */
export const extractValue = (serializedValue: SerializedValue): Value => {
  // Literals (string, number and boolean) are adopted as-is
  if (typeof serializedValue !== 'object') {
    return serializedValue
  }

  switch (serializedValue.type) {
    case 'bytes':
      return base64StringToBuffer(serializedValue.data)
    case 'bigint':
      return BigInt(serializedValue.data)
    default:
      throw new Error('Logic error: Unexpected value during extraction')
  }
}

/**
 * Serialize the given value.
 */
export const serializeValue = (value: Value): SerializedValue => {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean': {
      return value
    }
    case 'bigint': {
      return { type: 'bigint', data: value.toString() }
    }
    default: {
      if (value instanceof ArrayBuffer) {
        return { type: 'bytes', data: bufferToBase64String(value) }
      }
      throw new Error('Logic error: Unexpected value during serialization')
    }
  }
}

/**
 * Identify the type of the given value.
 */
export const identifyValueType = (value: Value): string => {
  switch (typeof value) {
    case 'string':
      return 'text'
    case 'number':
      return Number.isInteger(value) ? 'integer' : 'number'
    case 'boolean':
      return 'boolean'
    case 'bigint':
      return 'bigint'
    default: {
      if (value instanceof ArrayBuffer) {
        return 'bytes'
      }
    }
  }
  throw new Error('Logic error: Unexpected value during type identification')
}

/**
 * Identify the type of the given serialized value.
 */
export const identifySerializedValueType = (value: SerializedValue): string => {
  switch (typeof value) {
    case 'string':
      return 'text'
    case 'number':
      return Number.isInteger(value) ? 'integer' : 'number'
    case 'boolean':
      return 'boolean'
    default:
      switch (value.type) {
        case 'bytes':
          return 'bytes'
        case 'bigint':
          return 'bigint'
      }
  }
  throw new Error('Logic error: Unexpected value during type identification')
}

/**
 * Create an empty value of the given type.
 * @throws {Error} If no empty value is available for the given type
 */
export const createEmptyValue = (type: string = 'text'): Value => {
  switch (type) {
    case 'text':
      return ''
    case 'number':
    case 'integer':
      return 0
    case 'boolean':
      return false
    case 'bytes':
      return new ArrayBuffer(0)
    case 'bigint':
      return BigInt(0)
  }
  throw new Error('No empty value defined for type ' + type)
}

/**
 * Decide wether the given values are considered equal.
 */
export const compareValues = (a: Value, b: Value): boolean =>
  // TODO: Find a more efficient solution
  a === b ||
  compareSerializedValues(serializeValue(a), serializeValue(b))

/**
 * Decide wether the given serialized values are equal.
 */
export const compareSerializedValues = (a: SerializedValue, b: SerializedValue): boolean =>
  a === b ||
  (
    typeof a === 'object' &&
    typeof b === 'object' &&
    a.type === b.type &&
    a.data === b.data
  )

/**
 * Cast a value to the given type.
 * If no implicit conversion is available, `undefined` is returned.
 */
export const castValue = (
  value: Value,
  type: string
): Value | undefined => {
  // Bytes to text
  if (value instanceof ArrayBuffer && type === 'text') {
    const string = bufferToString(value)
    if (string !== undefined) {
      return string
    }
  }

  // Text to bytes
  if (typeof value === 'string' && type === 'bytes') {
    const buffer = stringToBuffer(value)
    if (buffer !== undefined) {
      return buffer
    }
  }

  // Cast to the same type
  if (identifyValueType(value) === type) {
    return value
  }

  // Cast to text
  if (type === 'text') {
    return stringifyValue(value)
  }

  return undefined
}

/**
 * Cast a serialized value to the given type.
 * If no implicit conversion is available, `undefined` is returned.
 */
export const castSerializedValue = (
  serializedValue: SerializedValue,
  type: string
): SerializedValue | undefined => {
  const value = extractValue(serializedValue)
  const castedValue = castValue(value, type)
  if (castedValue === undefined) {
    return undefined
  }
  return serializeValue(castedValue)
}

/**
 * Convert the given value to a string (e.g. for preview, coping to clipboard).
 */
export const stringifyValue = (value: Value): string => {
  const valueType = identifyValueType(value)
  switch (valueType) {
    case 'text': {
      return value as string
    }
    case 'number':
    case 'integer': {
      return (value as number).toString()
    }
    case 'boolean': {
      return (value as boolean) ? 'True' : 'False'
    }
    case 'bytes': {
      return bufferToHexString(value as ArrayBuffer)
    }
    default: {
      // Treat the value not of type never here as we might add additional types
      // without adding a way to stringify it
      return labelType(valueType)
    }
  }
}

/**
 * Check wether the given value is empty, if applicable.
 * The number 0 should not be considered empty.
 */
export const isEmptyValue = (value: Value): boolean => {
  return (
    value === '' ||
    (value instanceof ArrayBuffer && value.byteLength === 0)
  )
}

/**
 * Compose a preview string for the given serialized value.
 * If no preview is availabe, `undefined` is returned.
 */
export const previewSerializedValue = (
  serializedValue: SerializedValue,
  emptyLabel = '(empty)'
): string => {
  // TODO: Implement preview on serialized values without complete extraction
  const value = extractValue(serializedValue)
  if (isEmptyValue(value)) {
    return emptyLabel
  }
  if (value instanceof ArrayBuffer) {
    return bufferToHexString(value.slice(0, 15))
  }
  return stringifyValue(value).substring(0, 30)
}

/**
 * Create a masked preview string
 */
export const previewMaskedSerializedValue = (
  serializedValue: SerializedValue,
  emptyLabel = '(empty)'
): string => {
  // TODO: Implement preview on serialized values without complete extraction
  const value = extractValue(serializedValue)
  if (isEmptyValue(value)) {
    return emptyLabel
  }
  const string = previewSerializedValue(serializedValue, emptyLabel)
  return '•'.repeat(string.length)
}
