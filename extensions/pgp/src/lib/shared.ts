
export const isStringOrArrayBufferEmpty = (payload: string | ArrayBuffer): boolean => (
  (typeof payload === 'string' && payload === '') ||
  (typeof payload !== 'string' && payload.byteLength === 0)
)
