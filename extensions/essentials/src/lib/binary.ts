
import { lcm } from './math'

/**
 * Decode a binary buffer to a string using UTF-8 text encoding.
 * @return Decoded string or undefined, if decoding failed
 */
export const bufferToString = (buffer: ArrayBuffer): string | undefined => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch (error) {
    return undefined
  }
}

/**
 * Encode a string to a binary buffer using UTF-8 text encoding.
 */
export const stringToBuffer = (string: string): ArrayBuffer => {
  return new TextEncoder().encode(string).buffer
}

/**
 * Swap endianness on the given binary string.
 * @param data Binary string
 * @param wordLength Word length in bytes
 * @param padWords Wether to pad words
 */
export const swapBufferEndianness = (
  data: ArrayBuffer,
  wordLength: number,
  padWords: boolean = true
): ArrayBuffer => {
  const wordCount = Math.ceil(data.byteLength / wordLength)
  const byteLength = padWords ? wordCount * wordLength : data.byteLength
  const flooredHalfWordLength = Math.floor(wordLength / 2)

  const bytes = new Uint8Array(byteLength)
  bytes.set(new Uint8Array(data), 0)

  // Swap endianness in-place
  let temp, left, right
  for (let w = 0; w < wordCount; w++) {
    for (let i = 0; i < flooredHalfWordLength; i++) {
      // Calculate index from left and from right of the word
      left = w * wordLength + i
      right = w * wordLength + (wordLength - i - 1)

      // Swap bytes within word
      temp = bytes[left] ?? 0
      if (left < byteLength) {
        bytes[left] = bytes[right] ?? 0
      }
      if (right < byteLength) {
        bytes[right] = temp
      }
    }
  }

  return bytes.buffer
}

/**
 * Identify, if this code runs on a big-endian system.
 */
export const isBigEndianEnvironment = (): boolean =>
  (new Uint32Array((new Uint8Array([1, 2, 3, 4])).buffer))[0] === 0x01020304

/**
 * Transform binary content from one unit size to another.
 * @param inputUnits Input units
 * @param inUnitSize Unit size of the input (in bits)
 * @param outUnitSize Desired output unit size (in bits)
 */
export const transformUnitSize = (
  inputUnits: number[],
  inUnitSize: number,
  outUnitSize: number,
  forward: boolean
): number[] => {
  if (inUnitSize === outUnitSize) {
    return inputUnits
  }
  if (inputUnits.length === 0) {
    return []
  }

  // Some bits may not hold any information when decoding, see issue #40
  if (!forward) {
    [inUnitSize, outUnitSize] = [outUnitSize, inUnitSize]
  }

  const commonSize = lcm(inUnitSize, outUnitSize)
  const inUnits = commonSize / inUnitSize
  const outUnits = commonSize / outUnitSize

  const outputUnitsLength = forward
    ? Math.ceil((outUnits * inputUnits.length) / inUnits)
    : Math.floor((outUnits * inputUnits.length) / inUnits)
  const outputUnits = new Array<number>(outputUnitsLength)

  let remainingInBits, inUnit, moveBits
  let remainingOutBits = outUnitSize
  let outUnit = 0
  let o = 0

  for (let i = 0; i < inputUnits.length; i++) {
    inUnit = inputUnits[i]
    remainingInBits = inUnitSize

    while (remainingInBits > 0) {
      // If the current out unit is full, move to the next one
      if (remainingOutBits === 0) {
        outputUnits[o++] = outUnit
        // If the remaining input bits contain no information, don't add a null unit (only occurs when decoding)
        // TODO: This works, but I, anderium, don't like that this `if` executes on each iteration.
        if (o === outputUnitsLength) {
          o--
          break
        }
        outUnit = 0
        remainingOutBits = outUnitSize
      }

      // Copy piece to out unit
      moveBits = Math.min(remainingInBits, remainingOutBits)
      outUnit = (outUnit << moveBits) | (inUnit >> (remainingInBits - moveBits)) & ((1 << moveBits) - 1)
      remainingInBits -= moveBits
      remainingOutBits -= moveBits
    }
  }

  // Add padding to last out unit and append it
  outputUnits[o] = outUnit << remainingOutBits
  return outputUnits
}
