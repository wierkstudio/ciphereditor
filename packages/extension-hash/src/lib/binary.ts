
export const bufferToHexString = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer)).map(byte => ('0' + byte.toString(16)).slice(-2)).join('')
