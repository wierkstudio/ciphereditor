
import forge from 'node-forge'
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { byteStringBufferToArrayBuffer } from './shared/helpers'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-forge/des',
  label: 'DES encryption',
  description: 'Data Encryption Standard (DES) is a symmetric-key algorithm for data encryption',
  url: 'https://ciphereditor.com/explore/des-data-encryption-standard',
  keywords: ['block cipher', 'encryption'],
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
        data: 'Y2lwaGVyZWQ='
      },
      types: ['bytes']
    },
    {
      name: 'iv',
      label: 'Initialization vector',
      value: {
        type: 'bytes',
        data: 'AAECAwQFBgc='
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
          value: 'ECB',
          label: 'Electronic Codebook (ECB)'
        }
      ]
    },
    {
      name: 'encryptedData',
      value: {
        type: 'bytes',
        data: '+pg4BtejNxB9rAhFoIYgmBFSPd3pT0V+LB8naY7rj1PCGQ5UShGmgdKKn7JKJG+m'
      },
      types: ['bytes'],
      order: 1000
    }
  ]
}

type DESMode = 'CBC' | 'ECB'

const execute: OperationExecuteExport = async (request) => {
  const { values, controlPriorities } = request
  const keyBuffer = values.key as ArrayBuffer
  const ivBuffer = values.iv as ArrayBuffer
  const additionalDataBuffer = values.additionalData as ArrayBuffer
  const mode = values.mode as DESMode

  // Validate key
  if (keyBuffer.byteLength !== 8) {
    return {
      issues: [{
        level: 'error',
        message: 'Must be of length 8 bytes',
        targetControlNames: ['key']
      }]
    }
  }

  // Validate IV
  if (ivBuffer.byteLength !== 8) {
    return {
      issues: [{
        level: 'error',
        message: 'Must be of length 8 bytes',
        targetControlNames: ['iv']
      }]
    }
  }

  const key = forge.util.createBuffer(keyBuffer)
  const iv = forge.util.createBuffer(ivBuffer)
  const additionalData = forge.util.createBuffer(additionalDataBuffer).getBytes()
  const algorithm: forge.cipher.Algorithm = `DES-${mode}`

  const forward =
    controlPriorities.indexOf('data') <
    controlPriorities.indexOf('encryptedData')

  if (forward) {
    // DES encryption
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
    return { changes: [{ name: 'encryptedData', value: encryptedData }] }
  } else {
    // DES decryption
    const encryptedDataBuffer = values.encryptedData as ArrayBuffer
    const encryptedData = forge.util.createBuffer(encryptedDataBuffer)

    const cipher = forge.cipher.createDecipher(algorithm, key)
    cipher.start({ additionalData, iv })
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
