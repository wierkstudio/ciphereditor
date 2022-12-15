
/**
 * Turn a string to an array of Unicode code points.
 */
export const stringToUnicodeCodePoints = (string: string): number[] =>
  Array.from(string.normalize())
    .map(char => char.codePointAt(0))
    .filter(char => char !== undefined) as number[]

/**
 * Turn an array of Unicode code points into a string.
 */
export const stringFromUnicodeCodePoints = (codePoints: number[]): string =>
  codePoints.map(codePoint => String.fromCodePoint(codePoint)).join('')
