
import {
  createAdler32,
  createCRC32,
  createCRC32C,
  createKeccak,
  createMD4,
  createMD5,
  createRIPEMD160,
  createSHA1,
  createSHA224,
  createSHA256,
  createSHA384,
  createSHA512,
  createSHA3,
  createSM3,
  createWhirlpool,
  createHMAC
} from 'hash-wasm'
import { IHasher } from 'hash-wasm/dist/lib/WASMInterface'

const algorithms: {
  [name: string]: {
    create: () => Promise<IHasher>
    label: string
  }
} = {
  adler32: {
    create: createAdler32,
    label: 'Adler-32'
  },
  crc32: {
    create: createCRC32,
    label: 'CRC32'
  },
  crc32c: {
    create: createCRC32C,
    label: 'CRC32C'
  },
  'keccak-224': {
    create: createKeccak.bind(null, 224),
    label: 'Keccak-224'
  },
  'keccak-256': {
    create: createKeccak.bind(null, 256),
    label: 'Keccak-256'
  },
  'keccak-384': {
    create: createKeccak.bind(null, 384),
    label: 'Keccak-384'
  },
  'keccak-512': {
    create: createKeccak.bind(null, 512),
    label: 'Keccak-512'
  },
  md4: {
    create: createMD4,
    label: 'MD4'
  },
  md5: {
    create: createMD5,
    label: 'MD5'
  },
  ripemd160: {
    create: createRIPEMD160,
    label: 'RIPEMD-160'
  },
  sha1: {
    create: createSHA1,
    label: 'SHA-1'
  },
  sha224: {
    create: createSHA224,
    label: 'SHA-224'
  },
  sha256: {
    create: createSHA256,
    label: 'SHA-256'
  },
  sha384: {
    create: createSHA384,
    label: 'SHA-384'
  },
  sha512: {
    create: createSHA512,
    label: 'SHA-512'
  },
  'sha3-224': {
    create: createSHA3.bind(null, 224),
    label: 'SHA3-224'
  },
  'sha3-256': {
    create: createSHA3.bind(null, 256),
    label: 'SHA3-256'
  },
  'sha3-384': {
    create: createSHA3.bind(null, 384),
    label: 'SHA3-384'
  },
  'sha3-512': {
    create: createSHA3.bind(null, 512),
    label: 'SHA3-512'
  },
  sm3: {
    create: createSM3,
    label: 'SM3'
  },
  whirlpool: {
    create: createWhirlpool,
    label: 'Whirlpool'
  }
}

let lastUsedAlgorithm: string | undefined
let lastUsedHashFunction: Promise<IHasher> | undefined

const createAlgorithmHashFunction = async (algorithm: string): Promise<IHasher> => {
  const spec = algorithms[algorithm]
  if (spec === undefined) {
    throw new Error(`Unknown hash function '${algorithm}'`)
  }
  // Cache last used hash function
  if (lastUsedHashFunction === undefined || lastUsedAlgorithm !== algorithm) {
    lastUsedAlgorithm = algorithm
    lastUsedHashFunction = spec.create()
  }
  return await lastUsedHashFunction
}

export const getAlgorithmOptions = (): Array<{ value: string, label: string }> => {
  return Object.keys(algorithms).map((name: string) => ({
    value: name,
    label: algorithms[name].label
  }))
}

const prepareData = (data: string | ArrayBuffer): string | Uint8Array => {
  if (typeof data === 'string') {
    return data
  } else {
    return new Uint8Array(data)
  }
}

export const createDigest = async (
  algorithm: string,
  message: string | ArrayBuffer
): Promise<ArrayBuffer> => {
  const hashFunction = await createAlgorithmHashFunction(algorithm)
  hashFunction.init()
  hashFunction.update(prepareData(message))
  return hashFunction.digest('binary').buffer
}

export const createHMACDigest = async (
  algorithm: string,
  message: string | ArrayBuffer,
  key: string | ArrayBuffer
): Promise<ArrayBuffer> => {
  const childHashFunction = createAlgorithmHashFunction(algorithm)
  const hashFunction = await createHMAC(childHashFunction, prepareData(key))
  hashFunction.init()
  hashFunction.update(prepareData(message))
  return hashFunction.digest('binary').buffer
}
