
/**
 * Convert a byte array to a hex string
 */
export const bytesToHexString = (bytes: Uint8Array): string => {
  const size = bytes.length
  const hexChars = new Array(size * 2).fill('0')
  for (let i = 0; i < size; i++) {
    const byte = bytes[i]
    hexChars[i * 2] = (byte >>> 4).toString(16)
    hexChars[i * 2 + 1] = (byte & 0xF).toString(16)
  }
  return hexChars.join('')
}

/**
 * Convert a hex string to a byte array
 */
export const hexStringToBytes = (hexString: string): Uint8Array => {
  const size = Math.floor(hexString.length / 2)
  const bytes = new Uint8Array(size)
  for (let i = 0; i < size; i++) {
    bytes[i] = parseInt(hexString.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}
