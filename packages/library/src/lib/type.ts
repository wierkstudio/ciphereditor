
/**
 * Array of all available value types
 */
export const availableValueTypes = [
  'text',
  'number',
  'integer',
  'boolean',
  'bytes',
  'bigint'
]

/**
 * Label the given type.
 */
export const labelType = (type: string): string => {
  switch (type) {
    case 'bigint': {
      return 'BigInt'
    }
    default: {
      // Uppercase the first letter
      return type.substring(0, 1).toUpperCase() + type.substring(1)
    }
  }
}

/**
 * Check if a type is compatible to an array of value types.
 */
export const isTypeCompatibleToValueTypes = (type: string, types: string[]): boolean =>
  undefined !== types.find(isTypeCompatibleToValueType.bind(null, type))

/**
 * Check if a type is compatible to another value type.
 */
export const isTypeCompatibleToValueType = (a: string, b: string): boolean =>
  a === b || (a === 'integer' && b === 'number')
