
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'
import { bufferToHexString } from './lib/binary'
import { getAlgorithmChoices, createDigest } from './lib/digest'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/operation-hash/hash',
  label: 'Hash function',
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
      choices: getAlgorithmChoices()
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
  const message = request.values.message.data as string | ArrayBuffer
  const messageType = request.values.message.type
  const algorithm = request.values.algorithm.data as string
  const rawHash = await createDigest(algorithm, message)
  const hash = messageType === 'bytes' ? rawHash : bufferToHexString(rawHash)
  return { changes: [{ name: 'hash', value: hash }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
