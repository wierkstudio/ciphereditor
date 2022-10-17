
import * as openpgp from 'openpgp'
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { isStringOrArrayBufferEmpty } from './lib/shared'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-pgp/encryption',
  label: 'PGP Encryption',
  description: 'Apply OpenPGP encryption and decryption on text or binary messages',
  url: 'https://ciphereditor.com/operations/pgp-encryption',
  keywords: ['pgp', 'gpg'],
  reproducible: false,
  controls: [
    {
      name: 'message',
      initialValue: 'The quick brown fox jumps over the lazy dog.',
      types: ['text', 'bytes']
    },
    {
      name: 'password',
      initialValue: '',
      types: ['text'],
      maskPreview: true
    },
    {
      name: 'publicKey',
      description: 'Either used as encryption key or as optional validation key',
      initialValue: '',
      types: ['text', 'bytes']
    },
    {
      name: 'privateKey',
      description: 'Either used as optional siging key or as decryption key',
      initialValue: '',
      types: ['text', 'bytes']
    },
    {
      name: 'privateKeyPassphrase',
      initialValue: '',
      types: ['text'],
      maskPreview: true
    },
    {
      name: 'encryptedMessage',
      initialValue: '',
      types: ['text', 'bytes'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = async (request) => {
  const { values, controlPriorities } = request

  // Gather facts
  const isEncrypt = controlPriorities.indexOf('message') < controlPriorities.indexOf('encryptedMessage')
  const password = values.password !== '' ? values.password as string : undefined
  const rawPublicKey = values.publicKey as string | ArrayBuffer
  const rawPrivateKey = values.privateKey as string | ArrayBuffer
  const privateKeyPassphrase = values.privateKeyPassphrase as string

  // Read binary or armored public key
  let publicKey: openpgp.PublicKey | undefined
  if (!isStringOrArrayBufferEmpty(rawPublicKey)) {
    try {
      publicKey =
        typeof rawPublicKey === 'string'
          ? await openpgp.readKey({ armoredKey: rawPublicKey })
          : await openpgp.readKey({ binaryKey: new Uint8Array(rawPublicKey) })
    } catch (error: any) {
      return {
        type: 'error',
        message: 'Invalid PGP public key',
        controlName: 'publicKey'
      }
    }
  }

  // Read binary or armored private key
  let privateKey: openpgp.PrivateKey | undefined
  if (!isStringOrArrayBufferEmpty(rawPrivateKey)) {
    try {
      privateKey =
        typeof rawPrivateKey === 'string'
          ? await openpgp.readPrivateKey({ armoredKey: rawPrivateKey })
          : await openpgp.readPrivateKey({ binaryKey: new Uint8Array(rawPrivateKey) })
    } catch (error: any) {
      return {
        type: 'error',
        message: 'Invalid PGP private key',
        controlName: 'privateKey'
      }
    }
  }

  // Decrypt private key using passphrase
  if (privateKey !== undefined && !privateKey.isDecrypted()) {
    privateKey = await openpgp.decryptKey({
      privateKey: privateKey,
      passphrase: privateKeyPassphrase
    })
  }

  if (isEncrypt) {
    if (password === undefined && publicKey === undefined) {
      return {
        type: 'error',
        message: 'A password or public key is required to encrypt the given message'
      }
    }

    const rawMessage = values.message as string | ArrayBuffer
    let encryptedMessage
    try {
      // Maintain the value type to make it predictable and controllable
      if (typeof rawMessage === 'string') {
        encryptedMessage = await openpgp.encrypt({
          message: await openpgp.createMessage({
            text: rawMessage
          }),
          passwords: password !== undefined ? [password] : undefined,
          encryptionKeys: publicKey,
          signingKeys: privateKey,
          format: 'armored'
        }) as string
      } else {
        encryptedMessage = (await openpgp.encrypt({
          message: await openpgp.createMessage({
            binary: new Uint8Array(rawMessage)
          }),
          passwords: password !== undefined ? [password] : undefined,
          encryptionKeys: publicKey,
          signingKeys: privateKey,
          format: 'binary'
        }) as Uint8Array).buffer
      }
    } catch (error: unknown) {
      return {
        type: 'error',
        message: 'Error during encryption',
        description: error instanceof Error ? error.message : undefined
      }
    }

    return { changes: [{ name: 'encryptedMessage', value: encryptedMessage }] }
  } else {
    if (password === undefined && privateKey === undefined) {
      return {
        type: 'error',
        message: 'A password or private key is required to decrypt the given encrypted message'
      }
    }

    const rawEncryptedMessage = values.encryptedMessage as string | ArrayBuffer
    let decryptResult: openpgp.DecryptMessageResult
    try {
      // Maintain the value type to make it predictable and controllable
      if (typeof rawEncryptedMessage === 'string') {
        decryptResult = await openpgp.decrypt({
          message: await openpgp.readMessage({
            armoredMessage: rawEncryptedMessage
          }),
          passwords: password !== undefined ? [password] : undefined,
          decryptionKeys: privateKey,
          verificationKeys: publicKey,
          format: 'utf8'
        })
      } else {
        decryptResult = await openpgp.decrypt({
          message: await openpgp.readMessage({
            binaryMessage: new Uint8Array(rawEncryptedMessage)
          }),
          passwords: password !== undefined ? [password] : undefined,
          decryptionKeys: privateKey,
          verificationKeys: publicKey,
          format: 'binary'
        })
      }
    } catch (error: unknown) {
      return {
        type: 'error',
        message: 'Error during decryption',
        description: error instanceof Error ? error.message : undefined
      }
    }

    const decryptedData = decryptResult.data as string | Uint8Array
    const message = typeof decryptedData === 'string' ? decryptedData : decryptedData.buffer

    // Verify each signature against the public key
    const issues: OperationIssue[] = []
    for (const signature of decryptResult.signatures) {
      try {
        await signature.verified
        issues.push({
          level: 'info',
          message: `Found verified signature by key ${signature.keyID.toHex()}`,
          targetControlNames: ['message']
        })
      } catch (error: unknown) {
        issues.push({
          level: 'warn',
          message: `Found signature by key ${signature.keyID.toHex()} that could not be verified`,
          description: error instanceof Error ? error.message : undefined,
          targetControlNames: ['message']
        })
      }
    }

    return { changes: [{ name: 'message', value: message }], issues }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
