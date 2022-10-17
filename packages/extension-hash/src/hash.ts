
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { bufferToHexString } from './lib/binary'
import { getAlgorithmOptions, createDigest } from './lib/digest'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-hash/hash',
  label: 'Hash function',
  description: 'Map data of arbitrary size to hashes of fixed size',
  url: 'https://ciphereditor.com/operations/cryptographic-hash-function',
  keywords: ['digest', 'md5', 'sha'],
  controls: [
    {
      name: 'message',
      initialValue: 'The quick brown fox jumps over the lazy dog.',
      types: ['text', 'bytes']
    },
    {
      name: 'algorithm',
      initialValue: 'sha1',
      types: ['text'],
      options: getAlgorithmOptions()
    },
    {
      name: 'hash',
      initialValue: '408d94384216f890ff7a0c3528e8bed1e0b01621',
      types: ['text', 'bytes'],
      writable: false
    }
  ]
}

const execute: OperationExecuteExport = async (request) => {
  const message = request.values.message as string | ArrayBuffer
  const algorithm = request.values.algorithm as string
  const rawHash = await createDigest(algorithm, message)
  const hash = message instanceof ArrayBuffer ? rawHash : bufferToHexString(rawHash)
  return { changes: [{ name: 'hash', value: hash }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
