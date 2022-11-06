
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { mod } from './lib/math'

type Operator =
  'not' |
  'and' |
  'or' |
  'xor' |
  'nand' |
  'nor' |
  'nxor' |
  'add' |
  'sub'

/**
 * Object mapping operators to their respective labels
 */
const operatorLabelMap: Record<Operator, string> = {
  not: 'NOT ~a',
  and: 'AND (a & b)',
  or: 'OR (a | b)',
  xor: 'XOR (a ^ b)',
  nand: 'NAND ~(a & b)',
  nor: 'NOR ~(a | b)',
  nxor: 'NXOR ~(a ^ b)',
  add: 'ADD (a + b)',
  sub: 'SUB (a - b)'
}

/**
 * Object mapping operators to their inverse counterparts used when executing
 * the operation backwards
 */
const inverseOperatorMap: Record<Operator, Operator> = {
  not: 'not',
  and: 'nand',
  or: 'nor',
  xor: 'nxor',
  nand: 'and',
  nor: 'or',
  nxor: 'xor',
  add: 'sub',
  sub: 'add'
}

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/bitwise-operator',
  label: 'Bitwise operation',
  description: 'Operate on binary numerals (bit string) at the level of their individual bits.',
  url: 'https://ciphereditor.com/operations/bitwise-operator',
  keywords: ['and', 'or', 'xor', 'nand', 'nor', 'nxor', 'add', 'sub'],
  controls: [
    {
      name: 'data',
      value: { type: 'bytes', data: 'Y2lwaGVyZWRpdG9y' },
      types: ['bytes']
    },
    {
      name: 'key',
      value: { type: 'bytes', data: 'VQ==' },
      types: ['bytes']
    },
    {
      name: 'operator',
      value: 'xor' as Operator,
      types: ['text'],
      options: Object.entries(operatorLabelMap)
        .map(([value, label]) => ({ value, label }))
    },
    {
      name: 'encodedData',
      value: { type: 'bytes', data: 'NjwlPTAnMDE8ITon' },
      types: ['bytes'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { controlPriorities, values } = request

  const forward =
    controlPriorities.indexOf('data') <
    controlPriorities.indexOf('encodedData')
  const forwardOperator = values.operator as Operator
  const operator = forward ? forwardOperator : inverseOperatorMap[forwardOperator]

  const outputControl = forward ? 'encodedData' : 'data'
  const data = (forward ? values.data : values.encodedData) as ArrayBuffer
  const key = values.key as ArrayBuffer

  const bytes = new Uint8Array(data).slice()
  const keyBytes = new Uint8Array(key)
  const keyLength = key.byteLength
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = operateOnByte(bytes[i], keyBytes[i % keyLength], operator)
  }

  return { changes: [{ name: outputControl, value: bytes.buffer }] }
}

const operateOnByte = (a: number, b: number, operator: Operator): number => {
  switch (operator) {
    case 'not':
      return ~a & 0xff
    case 'and':
      return a & b
    case 'or':
      return a | b
    case 'xor':
      return a ^ b
    case 'nand':
      return ~(a & b)
    case 'nor':
      return ~(a | b)
    case 'nxor':
      return ~(a ^ b)
    case 'add':
      return (a + b) % 256
    case 'sub':
      return mod(a - b, 256)
    default:
      return a
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
