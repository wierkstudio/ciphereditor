
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

/**
 * Derive a unique name from the given name string and a set of used names.
 */
export const deriveUniqueName = (
  name: string,
  usedNames: string[],
  numberPrefix: string = ' '
): string => {
  if (!usedNames.includes(name)) {
    return name
  }
  let uniqueName
  let number = 0
  do {
    number++
    uniqueName = name + numberPrefix + number.toString()
  } while (usedNames.includes(uniqueName))
  return uniqueName
}
