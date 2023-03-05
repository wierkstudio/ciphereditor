
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { isBigEndianEnvironment, swapBufferEndianness } from './lib/binary'

// Typed arrays for bigint values are not available on every device we support
const OptionalBigUint64Array = BigUint64Array ?? undefined
const OptionalBigInt64Array = BigInt64Array ?? undefined

type NumberFormat = keyof (typeof formatTypedArrayMap)
const formatTypedArrayMap = {
  uint8: Uint8Array,
  int8: Int8Array,
  uint16: Uint16Array,
  int16: Int16Array,
  uint32: Uint32Array,
  int32: Int32Array,
  uint64: OptionalBigUint64Array,
  int64: OptionalBigInt64Array,
  float32: Float32Array,
  float64: Float64Array
}

const numberSeparatorRegExPattern = /[^0-9beox.-]+/i

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/number-encoder',
  label: 'Number encoder',
  description: 'Operation for encoding and decoding integers and IEEE 754 floating-point numbers.',
  url: 'https://ciphereditor.com/explore/integer-float-format',
  keywords: ['integer', 'float', 'number', 'ieee 754', 'bigint', 'digit', 'bytes', 'binary'],
  controls: [
    {
      name: 'numbers',
      value: '-1 0 1',
      types: ['text', 'number', 'integer', 'bigint']
    },
    {
      name: 'format',
      value: 'uint8',
      types: ['text'],
      options: [
        { value: 'uint8', label: '8-bit unsigned integer' },
        { value: 'int8', label: '8-bit signed integer' },
        { value: 'uint16', label: '16-bit unsigned integer' },
        { value: 'int16', label: '16-bit signed integer' },
        { value: 'uint32', label: '32-bit unsigned integer' },
        { value: 'int32', label: '32-bit signed integer' },
        { value: 'uint64', label: '64-bit unsigned integer' },
        { value: 'int64', label: '64-bit signed integer' },
        { value: 'float32', label: 'IEEE 754 Single-precision floating-point' },
        { value: 'float64', label: 'IEEE 754 Double-precision floating-point' }
      ]
    },
    {
      name: 'endianness',
      value: 'BE',
      types: ['text'],
      options: [
        { value: 'BE', label: 'Big-endian (BE)' },
        { value: 'LE', label: 'Little-endian (LE)' }
      ]
    },
    {
      name: 'encodedData',
      value: { type: 'bytes', data: '/wAB' },
      types: ['bytes'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request
  const forward =
    controlPriorities.indexOf('numbers') <
    controlPriorities.indexOf('encodedData')

  const format = values.format as NumberFormat
  const FormatTypedArray = formatTypedArrayMap[format]
  const bytesPerElement = FormatTypedArray.BYTES_PER_ELEMENT
  const useMultipleNumbers = typeof values.numbers === 'string'

  const bigEndian = values.endianness === 'BE'
  const systemBigEndian = isBigEndianEnvironment()

  // Handle undefined typed array
  if (FormatTypedArray === undefined) {
    return {
      issues: [
        {
          level: 'error',
          message: 'The selected format is not supported on this browser or device'
        }
      ]
    }
  }

  if (forward) {
    let encodedData: ArrayBuffer
    const bigintFormat =
      FormatTypedArray === OptionalBigUint64Array ||
      FormatTypedArray === OptionalBigInt64Array
    if (bigintFormat) {
      // Formats using the bigint type
      let numbers: bigint[]
      switch (typeof values.numbers) {
        case 'string': {
          numbers = values.numbers.split(numberSeparatorRegExPattern)
            .map(string => {
              try {
                return BigInt(string)
              } catch (error) {
                return undefined
              }
            })
            .filter(value => value !== undefined) as bigint[]
          break
        }
        case 'number': {
          numbers = [BigInt(values.numbers)]
          break
        }
        case 'bigint': {
          numbers = [values.numbers]
          break
        }
        default: {
          throw new Error(
            `Logic error: Unexpected numbers type ${typeof values.numbers}`)
        }
      }

      const length = numbers.length
      const byteLength = length * bytesPerElement
      encodedData = new ArrayBuffer(byteLength)
      const typedArray = new FormatTypedArray(encodedData)

      for (let i = 0; i < length; i++) {
        typedArray[i] = numbers[i]
      }
    } else {
      // Formats using the number type
      let numbers: number[]
      switch (typeof values.numbers) {
        case 'string': {
          const floatFormat = format === 'float32' || format === 'float64'
          numbers = values.numbers.split(numberSeparatorRegExPattern)
            .map(string => floatFormat ? parseFloat(string) : parseInt(string))
            .filter(value => !isNaN(value))
          break
        }
        case 'number': {
          numbers = [values.numbers]
          break
        }
        case 'bigint': {
          numbers = [Number(values.numbers)]
          break
        }
        default: {
          throw new Error(
            `Logic error: Unexpected numbers type ${typeof values.numbers}`)
        }
      }

      const length = numbers.length
      const byteLength = length * bytesPerElement
      encodedData = new ArrayBuffer(byteLength)
      const typedArray = new FormatTypedArray(encodedData)

      for (let i = 0; i < length; i++) {
        typedArray[i] = numbers[i]
      }
    }

    // Swap endianness, if necessary
    const value = systemBigEndian === bigEndian
      ? encodedData
      : swapBufferEndianness(encodedData, bytesPerElement)

    return { changes: [{ name: 'encodedData', value }] }
  } else {
    const rawEncodedData = values.encodedData as ArrayBuffer
    const encodedData = systemBigEndian === bigEndian
      ? rawEncodedData
      : swapBufferEndianness(rawEncodedData, bytesPerElement)

    const typedArray = new FormatTypedArray(encodedData)

    // Maintain the numbers control type
    if (!useMultipleNumbers) {
      const number = typedArray[0] ?? 0
      return { changes: [{ name: 'numbers', value: number }] }
    }

    const numbers = [...typedArray].map(value => value.toString()).join(' ')
    return { changes: [{ name: 'numbers', value: numbers }] }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
