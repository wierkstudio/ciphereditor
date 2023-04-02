
import forge from 'node-forge'
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { byteStringBufferToArrayBuffer } from './shared/helpers'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-forge/aes',
  label: 'AES encryption',
  description: 'Advanced Encryption Standard (AES) is a symmetric-key algorithm considered to be the most frequently used method of data encryption.',
  url: 'https://ciphereditor.com/explore/aes-encryption',
  keywords: ['rijndael', 'block cipher', 'encryption'],
  controls: [
    {
      name: 'data',
      value: {
        type: 'bytes',
        data: 'dGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
      },
      types: ['bytes']
    },
    {
      name: 'key',
      value: {
        type: 'bytes',
        data: 'Y2lwaGVyZWRpdG9yY2lwaGVyZWRpdG9y'
      },
      types: ['bytes']
    },
    {
      name: 'iv',
      label: 'Initialization vector',
      value: {
        type: 'bytes',
        data: 'AAAAAAAAAAAAAAAAAAAAAA=='
      },
      types: ['bytes']
    },
    {
      name: 'mode',
      value: 'CBC',
      types: ['text'],
      options: [
        {
          value: 'CBC',
          label: 'Cipher-Block Chaining (CBC)'
        },
        {
          value: 'CFB',
          label: 'Cipher Feedback (CFB)'
        },
        {
          value: 'OFB',
          label: 'Output Feedback (OFB)'
        },
        {
          value: 'CTR',
          label: 'Counter (CTR)'
        },
        {
          value: 'GCM',
          label: 'Galois/Counter Mode (GCM)'
        },
        {
          value: 'ECB',
          label: 'Electronic Codebook (ECB)'
        }
      ]
    },
    {
      name: 'additionalData',
      value: { type: 'bytes', data: '' },
      types: ['bytes']
    },
    {
      name: 'encryptedData',
      value: {
        type: 'bytes',
        data: 'iTrQ6VU8OAaF40MPEL8MA0Ium+vQg4wFhQwuPdMLdC4XVjlqoShtqsExQ3JtofkO'
      },
      types: ['bytes'],
      order: 1000
    },
    {
      name: 'tag',
      value: { type: 'bytes', data: '' },
      types: ['bytes'],
      order: 1000
    }
  ]
}

type AESMode = 'CBC' | 'CFB' | 'OFB' | 'CTR' | 'GCM' | 'ECB'

const execute: OperationExecuteExport = async (request) => {
  const { values, controlPriorities } = request
  const keyBuffer = values.key as ArrayBuffer
  const ivBuffer = values.iv as ArrayBuffer
  const additionalDataBuffer = values.additionalData as ArrayBuffer
  const mode = values.mode as AESMode

  // Validate key
  if (![16, 24, 32].includes(keyBuffer.byteLength)) {
    return {
      issues: [{
        level: 'error',
        message: 'Must be of length 16, 24, or 32 bytes',
        targetControlNames: ['key']
      }]
    }
  }

  const key = forge.util.createBuffer(keyBuffer)
  const iv = forge.util.createBuffer(ivBuffer)
  const additionalData = forge.util.createBuffer(additionalDataBuffer).getBytes()
  const algorithm: forge.cipher.Algorithm = `AES-${mode}`

  const forward =
    controlPriorities.indexOf('data') <
    controlPriorities.indexOf('encryptedData')

  if (forward) {
    // AES encryption
    const dataBuffer = values.data as ArrayBuffer
    const data = forge.util.createBuffer(dataBuffer)

    const cipher = forge.cipher.createCipher(algorithm, key)
    cipher.start({ additionalData, iv })
    cipher.update(data)

    if (!cipher.finish()) {
      return {
        issues: [{
          level: 'error',
          message: 'Unable to encrypt the data with these values'
        }]
      }
    }

    const encryptedData = byteStringBufferToArrayBuffer(cipher.output)
    return {
      changes: [
        { name: 'encryptedData', value: encryptedData },
        {
          name: 'tag',
          value: mode === 'GCM'
            ? byteStringBufferToArrayBuffer(cipher.mode.tag)
            : new ArrayBuffer(0)
        }
      ]
    }
  } else {
    // AES decryption
    const encryptedDataBuffer = values.encryptedData as ArrayBuffer
    const tagBuffer = values.tag as ArrayBuffer

    const encryptedData = forge.util.createBuffer(encryptedDataBuffer)
    const tag = mode === 'GCM'
      ? forge.util.createBuffer(tagBuffer)
      : undefined

    const cipher = forge.cipher.createDecipher(algorithm, key)
    cipher.start({ additionalData, iv, tag })
    cipher.update(encryptedData)

    if (!cipher.finish()) {
      return {
        issues: [{
          level: 'error',
          message: 'Unable to decrypt the encrypted data with these values'
        }]
      }
    }

    const data = byteStringBufferToArrayBuffer(cipher.output)
    return { changes: [{ name: 'data', value: data }] }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
