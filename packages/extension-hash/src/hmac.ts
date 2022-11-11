
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { bufferToHexString } from './lib/binary'
import { createHMACDigest, getAlgorithmOptions } from './lib/digest'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-hash/hmac',
  label: 'HMAC function',
  description: 'The hash-based message authentication code (HMAC) is used to verify both the data integrity and the authentication of a message.',
  url: 'https://ciphereditor.com/explore/hmac',
  keywords: ['digest'],
  controls: [
    {
      name: 'message',
      value: 'The quick brown fox jumps over the lazy dog.',
      types: ['text', 'bytes']
    },
    {
      name: 'key',
      value: 'ciphereditor',
      types: ['text', 'bytes']
    },
    {
      name: 'algorithm',
      value: 'sha1',
      types: ['text'],
      options: getAlgorithmOptions()
    },
    {
      name: 'hash',
      value: 'ee4075afc952fbc9534bd721bd4411a021a0e96c',
      types: ['text', 'bytes'],
      writable: false
    }
  ]
}

const execute: OperationExecuteExport = async (request) => {
  const message = request.values.message as string | ArrayBuffer
  const key = request.values.key as string | ArrayBuffer
  const algorithm = request.values.algorithm as string
  const rawHash = await createHMACDigest(algorithm, message, key)
  const hash = message instanceof ArrayBuffer ? rawHash : bufferToHexString(rawHash)
  return { changes: [{ name: 'hash', value: hash }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
