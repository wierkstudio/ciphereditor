
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { transformUnitSize } from './lib/binary'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/binary-slice',
  label: 'Binary slice',
  description: 'Extract a portion of a binary sequence that begins at a zero-based start index and ends before a zero-based end index. Negative indices may be used to indicate offsets from the end of the sequence.',
  keywords: ['trim', 'extract', 'substring'],
  controls: [
    {
      name: 'whole',
      value: { type: 'bytes', data: 'ABEiM0RVZneImQ==' },
      types: ['bytes']
    },
    {
      name: 'start',
      value: 3,
      types: ['integer']
    },
    {
      name: 'end',
      value: 7,
      types: ['integer']
    },
    {
      name: 'unit',
      value: 'byte',
      types: ['text'],
      options: [
        {
          value: 'bit',
          label: 'Bit'
        },
        {
          value: 'byte',
          label: 'Byte'
        }
      ]
    },
    {
      name: 'slice',
      value: { type: 'bytes', data: 'M0RVZg==' },
      types: ['bytes'],
      order: 1000,
      writable: false
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const whole = request.values.whole as ArrayBuffer
  const start = request.values.start as number
  const end = request.values.end as number
  const unit = request.values.unit as 'bit' | 'byte'

  let slice: ArrayBuffer
  switch (unit) {
    case 'bit': {
      const bytes = new Uint8Array(whole)

      // Roughly slice array of bytes around the requested bit slice
      const bitSliceArgs = normalizeSliceArgs(start, end, bytes.length * 8)
      const byteSliceStart = Math.floor(bitSliceArgs.start / 8)
      const byteSliceEnd = Math.floor(bitSliceArgs.end / 8) + 1
      const byteSlice = Array.from(bytes.slice(byteSliceStart, byteSliceEnd))

      // Transform the array of bytes to an array of bits and slice them
      // precisely to create the bit slice
      const bitSlice = transformUnitSize(byteSlice, 8, 1, true).slice(
        bitSliceArgs.start - byteSliceStart * 8,
        bitSliceArgs.end - byteSliceStart * 8
      )

      // Fill up the first byte with zero bits and turn the bits back into bytes
      const paddingBits = bitSlice.length % 8 > 0 ? 8 - bitSlice.length % 8 : 0
      const sliceBitsPadded = new Array(paddingBits).fill(0).concat(bitSlice)
      const sliceBytes = transformUnitSize(sliceBitsPadded, 8, 1, false)
      slice = new Uint8Array(sliceBytes).buffer
      break
    }
    case 'byte': {
      const sliceArgs = normalizeSliceArgs(start, end, whole.byteLength)
      slice = new Uint8Array(whole).slice(sliceArgs.start, sliceArgs.end).buffer
      break
    }
  }

  return { changes: [{ name: 'slice', value: slice }] }
}

/**
 * Normalize the given start and end slice arguments to absolute values.
 * @param start Zero-based index at which to begin extraction. Negative indices
 * may be used to indicate offsets from the end of the sequence.
 * @param end Zero-based index before which to end extraction. Negative indices
 * may be used to indicate offsets from the end of the sequence.
 * @param length String or array length
 */
const normalizeSliceArgs = (
  start: number,
  end: number,
  length: number
): { start: number, end: number } => {
  const normalizedStart = start >= 0
    ? Math.min(start, length)
    : Math.max(length + start, 0)
  const normalizedEnd = end >= 0
    ? Math.min(end, length)
    : Math.max(length + end, 0)
  return { start: normalizedStart, end: normalizedEnd }
}

export default {
  contribution,
  body: {
    execute
  }
}
