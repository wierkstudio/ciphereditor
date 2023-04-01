
import forge from 'node-forge'

export const byteStringBufferToArrayBuffer =
  (buffer: forge.util.ByteStringBuffer): ArrayBuffer =>
    new Uint8Array(buffer.length())
      .map((byte, index) => buffer.at(index))
      .buffer
