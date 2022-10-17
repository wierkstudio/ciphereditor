
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer'

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
 * Encode a binary buffer to a hex string
 */
export const bufferToHexString = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  const size = bytes.length
  const hexChars = new Array(size * 2).fill('0')
  for (let i = 0; i < size; i++) {
    const byte = bytes[i]
    hexChars[i * 2] = (byte >>> 4).toString(16)
    hexChars[i * 2 + 1] = (byte & 0xf).toString(16)
  }
  return hexChars.join('')
}

/**
 * Decode a hex string to a binary buffer
 */
export const hexStringToBuffer = (hexString: string): ArrayBuffer => {
  const size = Math.floor(hexString.length / 2)
  const bytes = new Uint8Array(size)
  for (let i = 0; i < size; i++) {
    bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes.buffer
}

/**
 * Encode a binary buffer to a base64 string
 */
export const bufferToBase64String = (buffer: ArrayBuffer): string =>
  base64Encode(buffer)

/**
 * Decode a base64 string to a binary buffer
 */
export const base64StringToBuffer = (base64String: string): ArrayBuffer =>
  base64Decode(base64String)
