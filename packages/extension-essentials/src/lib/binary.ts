
import { lcm } from './math'

/**
 * Decode a binary buffer to a string.
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
 * Encode a string to a binary buffer.
 */
export const stringToBuffer = (string: string): ArrayBuffer => {
  return new TextEncoder().encode(string).buffer
}

/**
 * Transform binary content from one unit size to another.
 * @param inputUnits Input units
 * @param inUnitSize Unit size of the input (in bits)
 * @param outUnitSize Desired output unit size (in bits)
 */
export const transformUnitSize = (
  inputUnits: number[],
  inUnitSize: number,
  outUnitSize: number
): number[] => {
  if (inUnitSize === outUnitSize) {
    return inputUnits
  }

  const commonSize = lcm(inUnitSize, outUnitSize)
  const inUnits = commonSize / inUnitSize
  const outUnits = commonSize / outUnitSize

  const outputUnitsLength = Math.ceil((outUnits * inputUnits.length) / inUnits)
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
  outputUnits[o++] = outUnit << remainingOutBits
  return outputUnits
}
