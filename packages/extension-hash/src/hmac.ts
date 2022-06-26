
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'
import { bufferToHexString } from './lib/binary'
import { getAlgorithmChoices, createHMACDigest } from './lib/digest'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/operation-hash/hmac',
  label: 'HMAC function',
  controls: [
    {
      name: 'message',
      initialValue: 'The quick brown fox jumps over the lazy dog.',
      types: ['text', 'bytes']
    },
    {
      name: 'key',
      initialValue: 'cryptii',
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
      initialValue: 'ee4075afc952fbc9534bd721bd4411a021a0e96c',
      types: ['text', 'bytes'],
      writable: false
    }
  ]
}

const execute: OperationExecuteExport = async (request) => {
  const message = request.values.message.data as string | ArrayBuffer
  const messageType = request.values.message.type
  const key = request.values.key.data as string | ArrayBuffer
  const algorithm = request.values.algorithm.data as string
  const rawHash = await createHMACDigest(algorithm, message, key)
  const hash = messageType === 'bytes' ? rawHash : bufferToHexString(rawHash)
  return { changes: [{ name: 'hash', value: hash }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
