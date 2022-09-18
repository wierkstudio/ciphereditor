
import * as openpgp from 'openpgp'
import { Contribution, OperationExecuteExport } from '@ciphereditor/types'
import { isStringOrArrayBufferEmpty } from './lib/shared'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-pgp/inspect-key',
  label: 'Inspect PGP Key',
  description: 'Inspect a given PGP key to reveal its type and fingerprint among other facts',
  url: 'https://ciphereditor.com/operations/pgp-encryption',
  keywords: ['pgp', 'gpg'],
  controls: [
    {
      name: 'key',
      initialValue: '',
      types: ['text', 'bytes']
    },
    {
      name: 'fingerprint',
      initialValue: '97c82fac489a31bd694cbce3103fe5948a2e073e',
      types: ['text'],
      writable: false,
      order: 1000
    },
    {
      name: 'private',
      initialValue: false,
      types: ['boolean'],
      writable: false,
      order: 1000
    },
    {
      name: 'creationTime',
      initialValue: '2022-09-18T15:48:24.000Z',
      types: ['text'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = async (request) => {
  const { values } = request

  const rawKey = values.key.data as string | ArrayBuffer
  let key: openpgp.PublicKey | openpgp.PrivateKey | undefined
  if (!isStringOrArrayBufferEmpty(rawKey)) {
    try {
      // Try reading a public key
      key = typeof rawKey === 'string'
        ? await openpgp.readKey({ armoredKey: rawKey })
        : await openpgp.readKey({ binaryKey: new Uint8Array(rawKey) })
    } catch (error: unknown) {
      try {
        // Try reading a private key
        key = typeof rawKey === 'string'
          ? await openpgp.readPrivateKey({ armoredKey: rawKey })
          : await openpgp.readPrivateKey({ binaryKey: new Uint8Array(rawKey) })
      } catch (error: unknown) {
        return {
          type: 'error',
          message: 'Invalid PGP key',
          controlName: 'key'
        }
      }
    }
  }

  // Handle empty state
  if (key === undefined) {
    return {
      changes: [
        { name: 'fingerprint', value: '' },
        { name: 'private', value: false },
        { name: 'creationTime', value: '' }
      ]
    }
  }

  return {
    changes: [
      { name: 'fingerprint', value: key.getFingerprint() },
      { name: 'private', value: key.isPrivate() },
      { name: 'creationTime', value: key.getCreationTime().toISOString() }
    ]
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
