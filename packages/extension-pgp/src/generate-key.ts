
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import * as openpgp from 'openpgp'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-pgp/generate-key',
  label: 'Generate PGP Key',
  description: 'Generate new PGP key pairs providing the private key, the public key and the revocation certificate',
  url: 'https://ciphereditor.com/operations/pgp-encryption',
  keywords: ['pgp', 'gpg'],
  reproducible: false,
  controls: [
    {
      name: 'type',
      value: 'ecc',
      types: ['text'],
      options: [
        { value: 'ecc', label: 'ECC' },
        { value: 'rsa', label: 'RSA' }
      ]
    },
    {
      name: 'eccCurve',
      label: 'Curve',
      value: 'curve25519',
      types: ['text'],
      options: [
        { value: 'curve25519', label: 'curve25519' },
        { value: 'ed25519', label: 'ed25519' },
        { value: 'p256', label: 'p256' },
        { value: 'p384', label: 'p384' },
        { value: 'p521', label: 'p521' }
      ]
    },
    {
      name: 'rsaBits',
      label: 'Bits',
      value: 4096,
      types: ['number'],
      options: [
        { value: 2048, label: '2048 bits' },
        { value: 3072, label: '3072 bits' },
        { value: 4096, label: '4096 bits' }
      ],
      enforceOptions: false
    },
    {
      name: 'passphrase',
      value: '',
      types: ['text'],
      maskPreview: true
    },
    {
      name: 'armored',
      description: 'Wether to use the armored text representation for keys',
      value: true,
      types: ['boolean']
    },
    {
      name: 'publicKey',
      value: '',
      types: ['text', 'bytes'],
      writable: false,
      order: 1000
    },
    {
      name: 'privateKey',
      value: '',
      types: ['text', 'bytes'],
      writable: false,
      order: 1000
    }
  ],
  timeout: 60000
}

const execute: OperationExecuteExport = async (request) => {
  const { values } = request

  // Gather facts
  const type = values.type as 'ecc' | 'rsa'
  const userId = {}
  const passphrase = values.passphrase as string
  const armored = values.armored as boolean

  // Generate key pair
  const { privateKey, publicKey } = await openpgp.generateKey({
    type,
    curve: values.eccCurve as openpgp.KeyOptions['curve'],
    rsaBits: values.rsaBits as number,
    userIDs: [userId],
    passphrase,
    format: 'object'
  })

  // Export keys
  const publicKeyExport = armored ? publicKey.armor() : publicKey.write().buffer
  const privateKeyExport = armored ? privateKey.armor() : privateKey.write().buffer

  return {
    changes: [
      { name: 'publicKey', value: publicKeyExport },
      { name: 'privateKey', value: privateKeyExport }
    ]
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
