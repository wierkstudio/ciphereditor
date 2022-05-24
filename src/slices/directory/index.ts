
import { createSlice } from '@reduxjs/toolkit'
import { DirectoryState } from './types'

const defaultDirectoryState: DirectoryState = {
  operationExtensions: [
    {
      operation: {
        name: 'cryptii/caesar-cipher',
        label: 'Caesar cipher',
        controls: [
          {
            name: 'plaintext',
            initialValue: 'The quick brown fox jumps over the lazy dog.',
            types: ['text']
          },
          {
            name: 'shift',
            initialValue: 7,
            types: ['integer']
          },
          {
            name: 'alphabet',
            initialValue: 'abcdefghijklmnopqrstuvwxyz',
            types: ['text']
          },
          {
            name: 'caseStrategy',
            initialValue: 'maintain',
            types: ['text'],
            choices: [
              { value: 'maintain', label: 'Maintain case' },
              { value: 'ignore', label: 'Ignore case' },
              { value: 'strict', label: 'Strict (A ≠ a)' }
            ]
          },
          {
            name: 'foreignStrategy',
            initialValue: 'maintain',
            types: ['text'],
            choices: [
              { value: 'maintain', label: 'Maintain foreign chars' },
              { value: 'ignore', label: 'Ignore foreign chars' }
            ]
          },
          {
            name: 'ciphertext',
            initialValue: 'Aol xbpjr iyvdu mve qbtwz vcly aol shgf kvn.',
            types: ['text'],
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-essentials.js',
        moduleId: 'caesar-cipher'
      }
    },
    {
      operation: {
        name: 'cryptii/rot13',
        label: 'ROT13',
        controls: [
          {
            name: 'plaintext',
            initialValue: 'The quick brown fox jumps over the lazy dog.',
            types: ['text']
          },
          {
            name: 'variant',
            initialValue: 'rot13',
            types: ['text'],
            choices: [
              { value: 'rot5', label: 'ROT5 (0-9)' },
              { value: 'rot13', label: 'ROT13 (A-Z, a-z)' },
              { value: 'rot18', label: 'ROT18 (0-9, A-Z, a-z)' },
              { value: 'rot47', label: 'ROT47 (!-~)' }
            ]
          },
          {
            name: 'ciphertext',
            initialValue: 'Gur dhvpx oebja sbk whzcf bire gur ynml qbt.',
            types: ['text'],
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-essentials.js',
        moduleId: 'rot13'
      }
    },
    {
      operation: {
        name: 'cryptii/word-counter',
        label: 'Word counter',
        controls: [
          {
            name: 'text',
            initialValue: 'The quick brown fox jumps over the lazy dog.',
            types: ['text']
          },
          {
            name: 'characterCount',
            initialValue: 44,
            types: ['integer'],
            writable: false,
            order: 1000
          },
          {
            name: 'wordCount',
            initialValue: 9,
            types: ['integer'],
            writable: false,
            order: 1000
          },
          {
            name: 'lineCount',
            initialValue: 1,
            types: ['integer'],
            writable: false,
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-essentials.js',
        moduleId: 'word-counter'
      }
    },
    {
      operation: {
        name: 'cryptii/hash',
        label: 'Cryptographic hash function',
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
            choices: [
              { value: 'adler32', label: 'Adler-32' },
              { value: 'crc32', label: 'CRC32' },
              { value: 'crc32c', label: 'CRC32C' },
              { value: 'keccak-224', label: 'Keccak-224' },
              { value: 'keccak-256', label: 'Keccak-256' },
              { value: 'keccak-384', label: 'Keccak-384' },
              { value: 'md4', label: 'MD4' },
              { value: 'md5', label: 'MD5' },
              { value: 'ripemd160', label: 'RIPEMD-160' },
              { value: 'sha1', label: 'SHA-1' },
              { value: 'sha224', label: 'SHA-224' },
              { value: 'sha256', label: 'SHA-256' },
              { value: 'sha384', label: 'SHA-384' },
              { value: 'sha512', label: 'SHA-512' },
              { value: 'sha3-224', label: 'SHA3-224' },
              { value: 'sha3-256', label: 'SHA3-256' },
              { value: 'sha3-384', label: 'SHA3-384' },
              { value: 'sha3-512', label: 'SHA3-512' },
              { value: 'sm3', label: 'SM3' },
              { value: 'whirlpool', label: 'Whirlpool' }
            ]
          },
          {
            name: 'hash',
            initialValue: '408d94384216f890ff7a0c3528e8bed1e0b01621',
            types: ['text', 'bytes'],
            writable: false,
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-hash.js',
        moduleId: 'hash'
      }
    },
    {
      operation: {
        name: 'cryptii/hmac',
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
            choices: [
              { value: 'adler32', label: 'Adler-32' },
              { value: 'crc32', label: 'CRC32' },
              { value: 'crc32c', label: 'CRC32C' },
              { value: 'keccak-224', label: 'Keccak-224' },
              { value: 'keccak-256', label: 'Keccak-256' },
              { value: 'keccak-384', label: 'Keccak-384' },
              { value: 'md4', label: 'MD4' },
              { value: 'md5', label: 'MD5' },
              { value: 'ripemd160', label: 'RIPEMD-160' },
              { value: 'sha1', label: 'SHA-1' },
              { value: 'sha224', label: 'SHA-224' },
              { value: 'sha256', label: 'SHA-256' },
              { value: 'sha384', label: 'SHA-384' },
              { value: 'sha512', label: 'SHA-512' },
              { value: 'sha3-224', label: 'SHA3-224' },
              { value: 'sha3-256', label: 'SHA3-256' },
              { value: 'sha3-384', label: 'SHA3-384' },
              { value: 'sha3-512', label: 'SHA3-512' },
              { value: 'sm3', label: 'SM3' },
              { value: 'whirlpool', label: 'Whirlpool' }
            ]
          },
          {
            name: 'hash',
            initialValue: 'ee4075afc952fbc9534bd721bd4411a021a0e96c',
            types: ['text', 'bytes'],
            writable: false,
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-hash.js',
        moduleId: 'hmac'
      }
    },
    {
      operation: {
        name: 'cryptii/logical-not',
        label: 'Logical NOT',
        controls: [
          {
            name: 'a',
            initialValue: false,
            types: ['boolean']
          },
          {
            name: 'notA',
            initialValue: true,
            types: ['boolean'],
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-essentials.js',
        moduleId: 'logical-not'
      }
    },
    {
      operation: {
        name: 'cryptii/logical-and',
        label: 'Logical AND',
        controls: [
          {
            name: 'a',
            initialValue: false,
            types: ['boolean']
          },
          {
            name: 'b',
            initialValue: false,
            types: ['boolean']
          },
          {
            name: 'aAndB',
            initialValue: false,
            types: ['boolean'],
            writable: false,
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-essentials.js',
        moduleId: 'logical-and'
      }
    },
    {
      operation: {
        name: 'cryptii/logical-or',
        label: 'Logical OR',
        controls: [
          {
            name: 'a',
            initialValue: false,
            types: ['boolean']
          },
          {
            name: 'b',
            initialValue: false,
            types: ['boolean']
          },
          {
            name: 'aOrB',
            initialValue: false,
            types: ['boolean'],
            writable: false,
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-essentials.js',
        moduleId: 'logical-or'
      }
    },
    {
      operation: {
        name: 'cryptii/google-translate',
        label: 'Google Translate',
        controls: [
          {
            name: 'source',
            initialValue: 'Hello, World.',
            types: ['text']
          },
          {
            name: 'sourceLanguage',
            initialValue: 'en',
            types: ['text'],
            choices: [
              { value: '', label: 'Detect' },
              { value: 'de', label: 'German' },
              { value: 'en', label: 'English' },
              { value: 'fr', label: 'French' },
              { value: 'lb', label: 'Luxembourgish' },
              { value: 'no', label: 'Norwegian' },
              { value: 'pl', label: 'Polish' },
              { value: 'pt', label: 'Portuguese (Portugal, Brazil)' }
            ]
          },
          {
            name: 'targetLanguage',
            initialValue: 'de',
            types: ['text'],
            choices: [
              { value: '', label: 'Detect' },
              { value: 'de', label: 'German' },
              { value: 'en', label: 'English' },
              { value: 'fr', label: 'French' },
              { value: 'lb', label: 'Luxembourgish' },
              { value: 'no', label: 'Norwegian' },
              { value: 'pl', label: 'Polish' },
              { value: 'pt', label: 'Portuguese (Portugal, Brazil)' }
            ]
          },
          {
            name: 'target',
            initialValue: 'Hallo Welt.',
            types: ['text'],
            order: 1000
          }
        ]
      },
      entryPoint: {
        bundleUrl: 'https://static.cryptii.blue/bundles/bundle-essentials.js',
        moduleId: 'translate'
      }
    }
  ]
}

export const directorySlice = createSlice({
  name: 'directory',
  initialState: defaultDirectoryState,
  reducers: {}
})

// export const {} = directorySlice.actions

export default directorySlice.reducer
