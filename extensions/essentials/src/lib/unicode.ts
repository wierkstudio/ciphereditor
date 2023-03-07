
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

/**
 * Array of known Unicode code points that are considered white spaces.
 * See https://en.wikipedia.org/w/index.php?title=Whitespace_character&oldid=1141655945#Unicode
 */
export const whitespaceCodePoints = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
]
