
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/rc4-cipher',
  label: 'RC4 cipher',
  description: 'Apply the RC4 (ARC4) stream cipher on a message',
  url: 'https://ciphereditor.com/explore/rc4-stream-cipher',
  keywords: ['rc4', 'arc4', 'stream cipher', 'PRGA'],
  controls: [
    {
      name: 'message',
      value: { type: 'bytes', data: 'dGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==' },
      types: ['bytes']
    },
    {
      name: 'key',
      value: { type: 'bytes', data: 'Y2lwaGVyZWRpdG9y' },
      types: ['bytes']
    },
    {
      name: 'encryptedMessage',
      value: { type: 'bytes', data: 'tA/5ZMhO8tp0WP41gHygRLj8kbA8NpF8uYlcgn21+i3I9ykSaZknNqaAjA==' },
      types: ['bytes'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request
  const forward =
    controlPriorities.indexOf('message') <
    controlPriorities.indexOf('encryptedMessage')

  const dataBuffer = forward
    ? values.message as ArrayBuffer
    : values.encryptedMessage as ArrayBuffer

  // Create a copy of the original array buffer to work on it in-place
  const data = new Uint8Array(dataBuffer.byteLength)
  data.set(new Uint8Array(dataBuffer), 0)
  const byteLength = data.length

  const keyBuffer = values.key as ArrayBuffer
  const key = new Uint8Array(keyBuffer)
  const keyByteLength = key.length

  let temp

  // Key-scheduling algorithm (KSA)
  const s = new Uint8Array(256)
  for (let i = 0; i < s.length; i++) {
    s[i] = i
  }

  let j = 0
  for (let i = 0; i < s.length; i++) {
    j = (j + s[i] + key[i % keyByteLength]) % s.length
    temp = s[i]
    s[i] = s[j]
    s[j] = temp
  }

  // In-place pseudo-random generation algorithm (PRGA)
  let i = 0
  j = 0

  let keyByte
  for (let k = 0; k < byteLength; k++) {
    i = (i + 1) % s.length
    j = (j + s[i]) % s.length
    temp = s[i]
    s[i] = s[j]
    s[j] = temp
    keyByte = s[(s[i] + s[j]) % s.length]
    data[k] ^= keyByte
  }

  const outputControl = forward ? 'encryptedMessage' : 'message'
  return { changes: [{ name: outputControl, value: data.buffer }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
