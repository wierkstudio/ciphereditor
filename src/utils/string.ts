
/**
 * Return wether the given string is numeric or not.
 */
export const isNumericString = (string: string): boolean => {
  if (typeof string !== 'string') {
    return false
  }
  if (string === '') {
    return false
  }
  return !Number.isNaN(parseFloat(string))
}

/**
 * Return wether the given string is a valid hex string.
 */
export const isHexString = (string: string): boolean =>
  string.length % 2 === 0 && /^[0-9A-Fa-f]*$/.test(string)
