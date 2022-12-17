
import { createSlice } from '@reduxjs/toolkit'
import { DirectoryState } from './types'

const defaultDirectoryState: DirectoryState = {
  // TODO: These contributions will be managed by an extension repository and
  // thus will be moved out of this repository eventually
  contributions: [
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/caesar-cipher',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Caesar cipher',
      description: 'Method in which each letter in a text is replaced by a letter a fixed number of places down the alphabet.',
      url: 'https://ciphereditor.com/explore/caesar-cipher',
      keywords: ['substitution', 'cipher', 'shift', 'julius'],
      controls: [
        {
          name: 'plaintext',
          value: 'The quick brown fox jumps over the lazy dog.',
          types: ['text']
        },
        {
          name: 'shift',
          value: 7,
          types: ['integer']
        },
        {
          name: 'alphabet',
          value: 'abcdefghijklmnopqrstuvwxyz',
          types: ['text'],
          options: [
            {
              value: 'abcdefghijklmnopqrstuvwxyz',
              label: 'Latin alphabet (a-z)'
            },
            {
              value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
              label: 'Uppercase Latin alphabet (A-Z)'
            },
            {
              value: 'αβγδεζηθικλμνξοπρστυφχψω',
              label: 'Greek alphabet (α-ω)'
            },
            {
              value: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
              label: 'Uppercase Greek alphabet (Α-Ω)'
            }
          ],
          enforceOptions: false
        },
        {
          name: 'ciphertext',
          value: 'Aol xbpjr iyvdu mve qbtwz vcly aol shgf kvn.',
          types: ['text'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/rot13',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'ROT13',
      description: 'Method in which each letter in a text is rotated by 13 places.',
      url: 'https://ciphereditor.com/explore/rot13',
      keywords: ['substitution', 'cipher', 'shift'],
      controls: [
        {
          name: 'plaintext',
          value: 'The quick brown fox jumps over the lazy dog.',
          types: ['text']
        },
        {
          name: 'variant',
          value: 'rot13',
          types: ['text'],
          options: [
            { value: 'rot5', label: 'ROT5 (0-9)' },
            { value: 'rot13', label: 'ROT13 (A-Z, a-z)' },
            { value: 'rot18', label: 'ROT18 (0-9, A-Z, a-z)' },
            { value: 'rot47', label: 'ROT47 (!-~)' }
          ]
        },
        {
          name: 'ciphertext',
          value: 'Gur dhvpx oebja sbk whzcf bire gur ynml qbt.',
          types: ['text'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/vigenere-cipher',
      label: 'Vigenère cipher',
      description: 'Method in which each letter in a text is replaced by a letter a number of places down the alphabet dependent on a provided key.',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      keywords: ['substitution cipher', 'shift', 'vigenere', 'key', 'beaufort', 'trithemius'],
      controls: [
        {
          name: 'plaintext',
          value: 'The quick brown fox jumps over the lazy dog.',
          types: ['text']
        },
        {
          name: 'variant',
          value: 'vigenere',
          types: ['text'],
          options: [
            {
              value: 'vigenere',
              label: 'Vigenère cipher'
            },
            {
              value: 'beaufort',
              label: 'Beaufort cipher'
            },
            {
              value: 'variantBeaufort',
              label: 'Variant Beaufort cipher'
            },
            {
              value: 'trithemius',
              label: 'Trithemius cipher'
            }
          ]
        },
        {
          name: 'key',
          value: 'ciphereditor',
          types: ['text']
        },
        {
          name: 'keyMode',
          value: 'repeat',
          types: ['text'],
          options: [
            { value: 'repeat', label: 'Repeat' },
            { value: 'autoKey', label: 'Auto-key' }
          ]
        },
        {
          name: 'alphabet',
          value: 'abcdefghijklmnopqrstuvwxyz',
          types: ['text'],
          options: [
            {
              value: 'abcdefghijklmnopqrstuvwxyz',
              label: 'Latin alphabet (a-z)'
            },
            {
              value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
              label: 'Uppercase Latin alphabet (A-Z)'
            },
            {
              value: 'αβγδεζηθικλμνξοπρστυφχψω',
              label: 'Greek alphabet (α-ω)'
            },
            {
              value: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
              label: 'Uppercase Greek alphabet (Α-Ω)'
            }
          ],
          enforceOptions: false
        },
        {
          name: 'ciphertext',
          value: 'Vpt xyzgn jkcnp nde nlqsa hjvt bwl prdb lhu.',
          types: ['text'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/polybius-square',
      label: 'Polybius square',
      description: 'Method in which the alphabet gets layed out in a grid that is then being used to represent each letter in the plaintext by its coordinates in the grid.',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      url: 'https://ciphereditor.com/explore/polybius-square-cipher',
      keywords: ['polybius checkerboard'],
      controls: [
        {
          name: 'plaintext',
          value: 'thequickbrownfoxjumpsoverthelazydog',
          types: ['text']
        },
        {
          name: 'alphabet',
          value: 'abcdefghiklmnopqrstuvwxyz',
          types: ['text'],
          options: [
            {
              value: 'abcdefghiklmnopqrstuvwxyz',
              label: 'Latin (a-z) without j'
            },
            {
              value: 'ABCDEFGHIKLMNOPQRSTUVWXYZ',
              label: 'Uppercase Latin (A-Z) without J'
            },
            {
              value: 'abcdefghijlmnopqrstuvwxyz',
              label: 'Latin (a-z) without k'
            },
            {
              value: 'ABCDEFGHIJLMNOPQRSTUVWXYZ',
              label: 'Uppercase Latin (A-Z) without K'
            },
            {
              value: 'αβγδεζηθικλμνξοπρστυφχψω',
              label: 'Greek (α-ω)'
            },
            {
              value: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
              label: 'Uppercase Greek (Α-Ω)'
            }
          ],
          enforceOptions: false
        },
        {
          name: 'columnSymbols',
          value: '12345',
          types: ['text']
        },
        {
          name: 'rowSymbols',
          value: '12345',
          types: ['text']
        },
        {
          name: 'separateCoordinates',
          value: false,
          types: ['boolean']
        },
        {
          name: 'ciphertext',
          value: '4423154145241325124234523321345324453235433451154244231531115554143422',
          types: ['text'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/letter-number-cipher',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Letter number cipher',
      description: 'Method in which each letter in a text is replaced by the corresponding position in the alphabet.',
      url: 'https://ciphereditor.com/explore/a1z26-letter-number-cipher',
      keywords: ['a1z26 cipher', 'letter number code', 'substitution cipher'],
      controls: [
        {
          name: 'letters',
          value: 'abcdefghijklmnopqrstuvwxyz',
          types: ['text']
        },
        {
          name: 'alphabet',
          value: 'abcdefghijklmnopqrstuvwxyz',
          types: ['text'],
          options: [
            {
              value: 'abcdefghijklmnopqrstuvwxyz',
              label: 'Latin alphabet (a-z)'
            },
            {
              value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
              label: 'Uppercase Latin alphabet (A-Z)'
            },
            {
              value: 'αβγδεζηθικλμνξοπρστυφχψω',
              label: 'Greek alphabet (α-ω)'
            },
            {
              value: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
              label: 'Uppercase Greek alphabet (Α-Ω)'
            }
          ],
          enforceOptions: false
        },
        {
          name: 'separator',
          value: ' ',
          types: ['text'],
          options: [
            { value: ' ', label: 'Space' },
            { value: ',', label: 'Comma (,)' },
            { value: ';', label: 'Semicolon (;)' },
            { value: '-', label: 'Minus (-)' },
            { value: '_', label: 'Underscore (_)' },
            { value: '\n', label: 'Newline (LF)' },
            { value: '\r\n', label: 'Newline (CR LF)' }
          ],
          enforceOptions: false
        },
        {
          name: 'numbers',
          value: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26',
          types: ['text'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/rc4-cipher',
      label: 'RC4 cipher',
      description: 'Apply the RC4 (ARC4) stream cipher on a message',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
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
          name: 'dropBytes',
          label: 'RC4-drop bytes',
          value: 768,
          types: ['integer']
        },
        {
          name: 'encryptedMessage',
          value: { type: 'bytes', data: '38WPTemiNf8Cxvpj/EZ22u94bH3P9iKONG7RUMzVvD0OapqZLOJ94n0AzQ==' },
          types: ['bytes'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-pgp/encryption',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-pgp/1.0.0-alpha.1/extension.js?v=1',
      label: 'PGP Encryption',
      description: 'Apply OpenPGP encryption and decryption on text or binary messages',
      url: 'https://ciphereditor.com/explore/pgp-encryption',
      keywords: ['pgp', 'gpg'],
      reproducible: false,
      controls: [
        {
          name: 'message',
          value: 'The quick brown fox jumps over the lazy dog.',
          types: ['text', 'bytes']
        },
        {
          name: 'password',
          value: '',
          types: ['text'],
          maskPreview: true
        },
        {
          name: 'publicKey',
          description: 'Either used as encryption key or as optional validation key',
          value: '',
          types: ['text', 'bytes']
        },
        {
          name: 'privateKey',
          description: 'Either used as optional siging key or as decryption key',
          value: '',
          types: ['text', 'bytes']
        },
        {
          name: 'privateKeyPassphrase',
          value: '',
          types: ['text'],
          maskPreview: true
        },
        {
          name: 'encryptedMessage',
          value: '',
          types: ['text', 'bytes'],
          order: 1000
        }
      ],
      timeout: 30000
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-pgp/generate-key',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-pgp/1.0.0-alpha.1/extension.js?v=1',
      label: 'Generate PGP Key',
      description: 'Generate new PGP key pairs providing the private key, the public key and the revocation certificate',
      url: 'https://ciphereditor.com/explore/pgp-encryption',
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
      timeout: 300000
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-pgp/inspect-key',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-pgp/1.0.0-alpha.1/extension.js?v=1',
      label: 'Inspect PGP Key',
      description: 'Inspect a given PGP key to reveal its type and fingerprint among other facts',
      url: 'https://ciphereditor.com/explore/pgp-encryption',
      keywords: ['pgp', 'gpg'],
      controls: [
        {
          name: 'key',
          value: '',
          types: ['text', 'bytes']
        },
        {
          name: 'fingerprint',
          value: '97c82fac489a31bd694cbce3103fe5948a2e073e',
          types: ['text'],
          writable: false,
          order: 1000
        },
        {
          name: 'private',
          value: false,
          types: ['boolean'],
          writable: false,
          order: 1000
        },
        {
          name: 'creationTime',
          value: '2022-09-18T15:48:24.000Z',
          types: ['text'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-hash/hash',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-hash/1.0.0-alpha.1/extension.js',
      label: 'Hash function',
      description: 'Map data of arbitrary size to hashes of fixed size',
      url: 'https://ciphereditor.com/explore/cryptographic-hash-function',
      keywords: ['digest', 'md5', 'sha'],
      controls: [
        {
          name: 'message',
          value: 'The quick brown fox jumps over the lazy dog.',
          types: ['text', 'bytes']
        },
        {
          name: 'algorithm',
          value: 'sha1',
          types: ['text'],
          options: [
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
          value: '408d94384216f890ff7a0c3528e8bed1e0b01621',
          types: ['text', 'bytes'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-hash/hmac',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-hash/1.0.0-alpha.1/extension.js',
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
          options: [
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
          value: 'ee4075afc952fbc9534bd721bd4411a021a0e96c',
          types: ['text', 'bytes'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-codepages/text-encoder',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-codepages/1.0.0-alpha.1/extension.js',
      label: 'Text encoder',
      description: 'Encode text into bytes using the chosen character encoding or vice-versa.',
      url: 'https://ciphereditor.com/explore/text-encoder',
      keywords: ['utf-8', 'oem', 'iso', 'windows', 'ibm', 'iscii', 'mac', 'character'],
      controls: [
        {
          name: 'text',
          value: 'ciphereditor',
          types: ['text']
        },
        {
          name: 'encoding',
          value: 65001,
          types: ['number'],
          options: [
            { value: 37, label: 'IBM EBCDIC US-Canada (37)' },
            { value: 437, label: 'OEM United States (437)' },
            { value: 500, label: 'IBM EBCDIC International (500)' },
            { value: 620, label: 'Mazovia (Polish) MS-DOS (620)' },
            { value: 708, label: 'Arabic (ASMO 708) (708)' },
            { value: 720, label: 'Arabic (Transparent ASMO); Arabic (DOS) (720)' },
            { value: 737, label: 'OEM Greek (formerly 437G); Greek (DOS) (737)' },
            { value: 775, label: 'OEM Baltic; Baltic (DOS) (775)' },
            { value: 808, label: 'OEM Russian; Cyrillic + Euro symbol (808)' },
            { value: 850, label: 'OEM Multilingual Latin 1; Western European (DOS) (850)' },
            { value: 852, label: 'OEM Latin 2; Central European (DOS) (852)' },
            { value: 855, label: 'OEM Cyrillic (primarily Russian) (855)' },
            { value: 857, label: 'OEM Turkish; Turkish (DOS) (857)' },
            { value: 858, label: 'OEM Multilingual Latin 1 + Euro symbol (858)' },
            { value: 860, label: 'OEM Portuguese; Portuguese (DOS) (860)' },
            { value: 861, label: 'OEM Icelandic; Icelandic (DOS) (861)' },
            { value: 862, label: 'OEM Hebrew; Hebrew (DOS) (862)' },
            { value: 863, label: 'OEM French Canadian; French Canadian (DOS) (863)' },
            { value: 864, label: 'OEM Arabic; Arabic (864) (864)' },
            { value: 865, label: 'OEM Nordic; Nordic (DOS) (865)' },
            { value: 866, label: 'OEM Russian; Cyrillic (DOS) (866)' },
            { value: 869, label: 'OEM Modern Greek; Greek, Modern (DOS) (869)' },
            { value: 870, label: 'IBM EBCDIC Multilingual/ROECE (Latin 2) (870)' },
            { value: 872, label: 'OEM Cyrillic (primarily Russian) + Euro Symbol (872)' },
            { value: 874, label: 'Windows-874 Thai (874)' },
            { value: 875, label: 'IBM EBCDIC Greek Modern (875)' },
            { value: 895, label: 'Kamenický (Czech) MS-DOS (895)' },
            { value: 932, label: 'Japanese Shift-JIS (932)' },
            { value: 936, label: 'Simplified Chinese GBK (936)' },
            { value: 949, label: 'Korean (949)' },
            { value: 950, label: 'Traditional Chinese Big5 (950)' },
            { value: 1010, label: 'IBM EBCDIC French (1010)' },
            { value: 1026, label: 'IBM EBCDIC Turkish (Latin 5) (1026)' },
            { value: 1047, label: 'IBM EBCDIC Latin 1/Open System (1047)' },
            { value: 1132, label: 'IBM EBCDIC Lao (1132/1133/1341)' },
            { value: 1140, label: 'IBM EBCDIC US-Canada (037 + Euro symbol) (1140)' },
            { value: 1141, label: 'IBM EBCDIC Germany (20273 + Euro symbol) (1141)' },
            { value: 1142, label: 'IBM EBCDIC Denmark-Norway (20277 + Euro symbol) (1142)' },
            { value: 1143, label: 'IBM EBCDIC Finland-Sweden (20278 + Euro symbol) (1143)' },
            { value: 1144, label: 'IBM EBCDIC Italy (20280 + Euro symbol) (1144)' },
            { value: 1145, label: 'IBM EBCDIC Latin America-Spain (20284 + Euro symbol) (1145)' },
            { value: 1146, label: 'IBM EBCDIC United Kingdom (20285 + Euro symbol) (1146)' },
            { value: 1147, label: 'IBM EBCDIC France (20297 + Euro symbol) (1147)' },
            { value: 1148, label: 'IBM EBCDIC International (500 + Euro symbol) (1148)' },
            { value: 1149, label: 'IBM EBCDIC Icelandic (20871 + Euro symbol) (1149)' },
            { value: 1200, label: 'UTF-16LE (1200)' },
            { value: 1201, label: 'UTF-16BE (1201)' },
            { value: 1250, label: 'Windows-1250 Central European (1250)' },
            { value: 1251, label: 'Windows-1251 Cyrillic (1251)' },
            { value: 1252, label: 'Windows-1252 Latin (1252)' },
            { value: 1253, label: 'Windows-1253 Greek (1253)' },
            { value: 1254, label: 'Windows-1254 Turkish (1254)' },
            { value: 1255, label: 'Windows-1255 Hebrew (1255)' },
            { value: 1256, label: 'Windows-1256 Arabic (1256)' },
            { value: 1257, label: 'Windows-1257 Baltic (1257)' },
            { value: 1258, label: 'Windows-1258 Vietnam (1258)' },
            { value: 1361, label: 'Korean (Johab) (1361)' },
            { value: 10000, label: 'MAC Roman (10000)' },
            { value: 10001, label: 'Japanese (Mac) (10001)' },
            { value: 10002, label: 'MAC Traditional Chinese (Big5) (10002)' },
            { value: 10003, label: 'Korean (Mac) (10003)' },
            { value: 10004, label: 'Arabic (Mac) (10004)' },
            { value: 10005, label: 'Hebrew (Mac) (10005)' },
            { value: 10006, label: 'Greek (Mac) (10006)' },
            { value: 10007, label: 'Cyrillic (Mac) (10007)' },
            { value: 10008, label: 'MAC Simplified Chinese (GB 2312) (10008)' },
            { value: 10010, label: 'Romanian (Mac) (10010)' },
            { value: 10017, label: 'Ukrainian (Mac) (10017)' },
            { value: 10021, label: 'Thai (Mac) (10021)' },
            { value: 10029, label: 'MAC Latin 2 (Central European) (10029)' },
            { value: 10079, label: 'Icelandic (Mac) (10079)' },
            { value: 10081, label: 'Turkish (Mac) (10081)' },
            { value: 10082, label: 'Croatian (Mac) (10082)' },
            { value: 12000, label: 'UTF-32LE (12000)' },
            { value: 12001, label: 'UTF-32BE (12001)' },
            { value: 20000, label: 'CNS Taiwan (Chinese Traditional) (20000)' },
            { value: 20001, label: 'TCA Taiwan (20001)' },
            { value: 20002, label: 'ETEN Taiwan (Chinese Traditional) (20002)' },
            { value: 20003, label: 'IBM5550 Taiwan (20003)' },
            { value: 20004, label: 'TeleText Taiwan (20004)' },
            { value: 20005, label: 'Wang Taiwan (20005)' },
            { value: 20105, label: 'Western European IA5 (IRV International Alphabet 5) (20105)' },
            { value: 20106, label: 'IA5 German (7-bit) (20106)' },
            { value: 20107, label: 'IA5 Swedish (7-bit) (20107)' },
            { value: 20108, label: 'IA5 Norwegian (7-bit) (20108)' },
            { value: 20127, label: 'US-ASCII (7-bit) (20127)' },
            { value: 20261, label: 'T.61 (20261)' },
            { value: 20269, label: 'ISO 6937 Non-Spacing Accent (20269)' },
            { value: 20273, label: 'IBM EBCDIC Germany (20273)' },
            { value: 20277, label: 'IBM EBCDIC Denmark-Norway (20277)' },
            { value: 20278, label: 'IBM EBCDIC Finland-Sweden (20278)' },
            { value: 20280, label: 'IBM EBCDIC Italy (20280)' },
            { value: 20284, label: 'IBM EBCDIC Latin America-Spain (20284)' },
            { value: 20285, label: 'IBM EBCDIC United Kingdom (20285)' },
            { value: 20290, label: 'IBM EBCDIC Japanese Katakana Extended (20290)' },
            { value: 20297, label: 'IBM EBCDIC France (20297)' },
            { value: 20420, label: 'IBM EBCDIC Arabic (20420)' },
            { value: 20423, label: 'IBM EBCDIC Greek (20423)' },
            { value: 20424, label: 'IBM EBCDIC Hebrew (20424)' },
            { value: 20833, label: 'IBM EBCDIC Korean Extended (20833)' },
            { value: 20838, label: 'IBM EBCDIC Thai (20838)' },
            { value: 20866, label: 'KOI8-R Russian Cyrillic (20866)' },
            { value: 20871, label: 'IBM EBCDIC Icelandic (20871)' },
            { value: 20880, label: 'IBM EBCDIC Cyrillic Russian (20880)' },
            { value: 20905, label: 'IBM EBCDIC Turkish (20905)' },
            { value: 20924, label: 'IBM EBCDIC Latin 1/Open System (1047 + Euro symbol) (20924)' },
            { value: 20932, label: 'Japanese (JIS 0208-1990 and 0212-1990) (20932)' },
            { value: 20936, label: 'Simplified Chinese GB2312 (20936)' },
            { value: 20949, label: 'Korean Wansung (20949)' },
            { value: 21025, label: 'IBM EBCDIC Cyrillic Serbian-Bulgarian (21025)' },
            { value: 21027, label: 'Extended/Ext Alpha Lowercase (21027)' },
            { value: 21866, label: 'KOI8-U Ukrainian Cyrillic (21866)' },
            { value: 28591, label: 'ISO-8859-1 Latin 1 Western European (28591)' },
            { value: 28592, label: 'ISO-8859-2 Latin 2 Central European (28592)' },
            { value: 28593, label: 'ISO-8859-3 Latin 3 South European (28593)' },
            { value: 28594, label: 'ISO-8859-4 Latin 4 North European (28594)' },
            { value: 28595, label: 'ISO-8859-5 Latin/Cyrillic (28595)' },
            { value: 28596, label: 'ISO-8859-6 Latin/Arabic (28596)' },
            { value: 28597, label: 'ISO-8859-7 Latin/Greek (28597)' },
            { value: 28598, label: 'ISO-8859-8 Latin/Hebrew (28598)' },
            { value: 28599, label: 'ISO-8859-9 Latin 5 Turkish (28599)' },
            { value: 28600, label: 'ISO-8859-10 Latin 6 Nordic (28600)' },
            { value: 28601, label: 'ISO-8859-11 Latin/Thai (28601)' },
            { value: 28603, label: 'ISO-8859-13 Latin 7 Baltic Rim (28603)' },
            { value: 28604, label: 'ISO-8859-14 Latin 8 Celtic (28604)' },
            { value: 28605, label: 'ISO-8859-15 Latin 9 (28605)' },
            { value: 28606, label: 'ISO-8859-16 Latin 10 (28606)' },
            { value: 29001, label: 'Europa 3 (29001)' },
            { value: 38598, label: 'ISO 8859-8 Hebrew (ISO-Logical) (38598)' },
            { value: 47451, label: 'Atari ST/TT (47451)' },
            { value: 50220, label: 'ISO 2022 JIS Japanese with no halfwidth Katakana (50220)' },
            { value: 50221, label: 'ISO 2022 JIS Japanese with halfwidth Katakana (50221)' },
            { value: 50222, label: 'ISO 2022 Japanese JIS X 0201-1989 (1 byte Kana-SO/SI) (50222)' },
            { value: 50225, label: 'ISO 2022 Korean (50225)' },
            { value: 50227, label: 'ISO 2022 Simplified Chinese (50227)' },
            { value: 51932, label: 'EUC Japanese (51932)' },
            { value: 51936, label: 'EUC Simplified Chinese (51936)' },
            { value: 51949, label: 'EUC Korean (51949)' },
            { value: 52936, label: 'HZ-GB2312 Simplified Chinese (52936)' },
            { value: 54936, label: 'Simplified Chinese GB18030 (54936)' },
            { value: 57002, label: 'ISCII Devanagari (57002)' },
            { value: 57003, label: 'ISCII Bengali (57003)' },
            { value: 57004, label: 'ISCII Tamil (57004)' },
            { value: 57005, label: 'ISCII Telugu (57005)' },
            { value: 57006, label: 'ISCII Assamese (57006)' },
            { value: 57007, label: 'ISCII Oriya (57007)' },
            { value: 57008, label: 'ISCII Kannada (57008)' },
            { value: 57009, label: 'ISCII Malayalam (57009)' },
            { value: 57010, label: 'ISCII Gujarati (57010)' },
            { value: 57011, label: 'ISCII Punjabi (57011)' },
            { value: 65000, label: 'UTF-7 (65000)' },
            { value: 65001, label: 'UTF-8 (65001)' }
          ]
        },
        {
          name: 'bytes',
          value: { type: 'bytes', data: 'Y2lwaGVyZWRpdG9y' },
          types: ['bytes'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/number-encoder',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Number encoder',
      description: 'Operation for encoding and decoding integers and IEEE 754 floating-point numbers.',
      url: 'https://ciphereditor.com/explore/integer-float-format',
      keywords: ['integer', 'float', 'number', 'ieee 754', 'bigint', 'digit', 'bytes', 'binary'],
      controls: [
        {
          name: 'numbers',
          value: '-1 0 1',
          types: ['text', 'number', 'integer', 'bigint']
        },
        {
          name: 'format',
          value: 'uint8',
          types: ['text'],
          options: [
            { value: 'uint8', label: '8-bit unsigned integer' },
            { value: 'int8', label: '8-bit signed integer' },
            { value: 'uint16', label: '16-bit unsigned integer' },
            { value: 'int16', label: '16-bit signed integer' },
            { value: 'uint32', label: '32-bit unsigned integer' },
            { value: 'int32', label: '32-bit signed integer' },
            { value: 'uint64', label: '64-bit unsigned integer' },
            { value: 'int64', label: '64-bit signed integer' },
            { value: 'float32', label: 'IEEE 754 Single-precision floating-point' },
            { value: 'float64', label: 'IEEE 754 Double-precision floating-point' }
          ]
        },
        {
          name: 'endianness',
          value: 'BE',
          types: ['text'],
          options: [
            { value: 'BE', label: 'Big-endian (BE)' },
            { value: 'LE', label: 'Little-endian (LE)' }
          ]
        },
        {
          name: 'encodedData',
          value: { type: 'bytes', data: '/wAB' },
          types: ['bytes'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/binary-to-text',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Binary to text encoding',
      description: 'Operation for commonly used base64, base32, base16, hex, and binary encoding schemes.',
      url: 'https://ciphereditor.com/explore/binary-to-text',
      keywords: ['base64', 'base32', 'base16', 'binary'],
      controls: [
        {
          name: 'data',
          value: 'The quick brown fox jumps over the lazy dog.',
          types: ['bytes', 'text']
        },
        {
          name: 'alphabet',
          value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
          types: ['text'],
          options: [
            {
              value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
              label: 'base64'
            },
            {
              value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
              label: 'base64url'
            },
            {
              value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
              label: 'base32'
            },
            {
              value: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
              label: 'base32hex'
            },
            {
              value: 'ybndrfg8ejkmcpqxot1uwisza345h769',
              label: 'z-base-32'
            },
            {
              value: '0123456789ABCDEF',
              label: 'base16, hex'
            },
            {
              value: '0123',
              label: 'base4, quaternary'
            },
            {
              value: '01',
              label: 'base2, binary'
            }
          ],
          enforceOptions: false
        },
        {
          name: 'padding',
          value: '=',
          types: ['text'],
          options: [
            { value: '', label: 'None' },
            { value: '=', label: 'Equals sign (=)' }
          ],
          enforceOptions: false
        },
        {
          name: 'encodedData',
          value: 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=',
          types: ['text'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/swap-endianness',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Swap endianness',
      description: 'Switch bit string from big-endian to little-endian or vice-versa.',
      url: 'https://ciphereditor.com/explore/swap-endianness',
      keywords: ['binary', 'bytes', 'words', 'bit'],
      controls: [
        {
          name: 'data',
          value: { type: 'bytes', data: 'Y2lwaGVyZWRpdG9y' },
          types: ['bytes']
        },
        {
          name: 'wordLength',
          label: 'Word byte length',
          value: 4,
          types: ['integer']
        },
        {
          name: 'padWords',
          label: 'Pad incomplete words',
          value: true,
          types: ['boolean']
        },
        {
          name: 'transformedData',
          value: { type: 'bytes', data: 'aHBpY2RlcmVyb3Rp' },
          types: ['bytes'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/addition',
      extensionUrl: 'https://localhost:3010/extensions/essentials/extension.js',
      label: 'Addition',
      description: 'Adds two numbers together',
      url: 'https://ciphereditor.com/explore/arithmetic-operators',
      keywords: ['add', 'addition', 'term', 'sum', 'plus', '+', 'arithmetic'],
      controls: [
        {
          name: 'term1',
          label: 'Term 1',
          value: 0,
          types: ['integer', 'number', 'bigint']
        },
        {
          name: 'term2',
          label: 'Term 2',
          value: 0,
          types: ['integer', 'number', 'bigint']
        },
        {
          name: 'sum',
          value: 0,
          types: ['integer', 'number', 'bigint'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/subtraction',
      extensionUrl: 'https://localhost:3010/extensions/essentials/extension.js',
      label: 'Subtraction',
      description: 'Subtracts one number from another',
      url: 'https://ciphereditor.com/explore/arithmetic-operators',
      keywords: ['sub', 'difference', 'minus', '-', 'arithmetic'],
      controls: [
        {
          name: 'term1',
          label: 'Term 1',
          value: 0,
          types: ['integer', 'number', 'bigint']
        },
        {
          name: 'term2',
          label: 'Term 2',
          value: 0,
          types: ['integer', 'number', 'bigint']
        },
        {
          name: 'difference',
          value: 0,
          types: ['integer', 'number', 'bigint'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/multiplication',
      extensionUrl: 'https://localhost:3010/extensions/essentials/extension.js',
      label: 'Multiplication',
      description: 'Multiplies two numbers together',
      url: 'https://ciphereditor.com/explore/arithmetic-operators',
      keywords: ['multiply', 'factor', 'product', 'times', '*', 'arithmetic'],
      controls: [
        {
          name: 'factor1',
          label: 'Factor 1',
          value: 1,
          types: ['integer', 'number', 'bigint']
        },
        {
          name: 'factor2',
          label: 'Factor 2',
          value: 1,
          types: ['integer', 'number', 'bigint']
        },
        {
          name: 'product',
          value: 1,
          types: ['integer', 'number', 'bigint'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/division',
      extensionUrl: 'https://localhost:3010/extensions/essentials/extension.js',
      label: 'Division',
      description: 'Divides one number by another',
      url: 'https://ciphereditor.com/explore/arithmetic-operators',
      keywords: ['dividend', 'divisor', 'quotient', 'integer', '/', 'mod', 'remainder', '%', 'arithmetic'],
      controls: [
        {
          name: 'dividend',
          value: 1,
          types: ['integer', 'number', 'bigint']
        },
        {
          name: 'divisor',
          value: 1,
          types: ['integer', 'number', 'bigint']
        },
        {
          name: 'quotient',
          value: 1,
          types: ['integer', 'number', 'bigint'],
          writable: false,
          order: 1000
        },
        {
          name: 'integerQuotient',
          value: 1,
          types: ['integer', 'bigint'],
          writable: false,
          order: 1000
        },
        {
          name: 'remainder',
          value: 0,
          types: ['integer', 'bigint'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/trigonometric-function',
      extensionUrl: 'https://localhost:3010/extensions/essentials/extension.js',
      label: 'Trigonometric function',
      description: 'Provide functions sine, cosine, tangent as well as their hyperbolic counterparts and inverses',
      url: 'https://ciphereditor.com/explore/trigonometric-functions',
      keywords: ['sine', 'cosine', 'tangent', 'hyperbolic', 'radians', 'degrees', 'turns'],
      controls: [
        {
          name: 'angle',
          value: 0,
          types: ['integer', 'number']
        },
        {
          name: 'angleUnit',
          value: 'radian',
          types: ['text'],
          options: [
            { value: 'radian', label: 'Radians (rad)' },
            { value: 'degree', label: 'Degrees (°)' },
            { value: 'turn', label: 'Turns (rev)' }
          ]
        },
        {
          name: 'function',
          value: 'sin',
          types: ['text'],
          options: [
            { value: 'sin', label: 'Sine (sin)' },
            { value: 'cos', label: 'Cosine (cos)' },
            { value: 'tan', label: 'Tangent (tan)' },
            { value: 'sinh', label: 'Hyperbolic sine (sinh)' },
            { value: 'cosh', label: 'Hyperbolic cosine (cosh)' },
            { value: 'tanh', label: 'Hyperbolic tangent (tanh)' }
          ]
        },
        {
          name: 'functionValue',
          value: 0,
          types: ['integer', 'number'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/bitwise-operator',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Bitwise operator',
      description: 'Operate on binary numerals (bit string) at the level of their individual bits.',
      url: 'https://ciphereditor.com/explore/bitwise-operator',
      keywords: ['and', 'or', 'xor', 'nand', 'nor', 'nxor', 'add', 'sub'],
      controls: [
        {
          name: 'data',
          value: { type: 'bytes', data: 'Y2lwaGVyZWRpdG9y' },
          types: ['bytes']
        },
        {
          name: 'key',
          value: { type: 'bytes', data: 'VQ==' },
          types: ['bytes']
        },
        {
          name: 'operator',
          value: 'xor',
          types: ['text'],
          options: [
            { value: 'not', label: 'NOT ~a' },
            { value: 'and', label: 'AND (a & b)' },
            { value: 'or', label: 'OR (a | b)' },
            { value: 'xor', label: 'XOR (a ^ b)' },
            { value: 'nand', label: 'NAND ~(a & b)' },
            { value: 'nor', label: 'NOR ~(a | b)' },
            { value: 'nxor', label: 'NXOR ~(a ^ b)' },
            { value: 'add', label: 'ADD (a + b)' },
            { value: 'sub', label: 'SUB (a - b) }' }
          ]
        },
        {
          name: 'encodedData',
          value: { type: 'bytes', data: 'NjwlPTAnMDE8ITon' },
          types: ['bytes'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/logical-not',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Logical NOT',
      description: 'Takes truth to falsity and vice versa',
      url: 'https://ciphereditor.com/explore/logical-and-or-not',
      keywords: ['boolean', 'invert', 'complement', 'negation'],
      controls: [
        {
          name: 'a',
          label: 'A',
          value: false,
          types: ['boolean']
        },
        {
          name: 'notA',
          label: 'NOT A',
          value: true,
          types: ['boolean'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/logical-and',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Logical AND',
      description: 'Output true if and only if all the operands are true',
      url: 'https://ciphereditor.com/explore/logical-and-or-not',
      keywords: ['boolean'],
      controls: [
        {
          name: 'a',
          label: 'A',
          value: false,
          types: ['boolean']
        },
        {
          name: 'b',
          label: 'B',
          value: false,
          types: ['boolean']
        },
        {
          name: 'aAndB',
          label: 'A AND B',
          value: false,
          types: ['boolean'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/logical-or',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Logical OR',
      description: 'Output true if and only if one or more of its operands is true',
      url: 'https://ciphereditor.com/explore/logical-and-or-not',
      keywords: ['boolean', 'alternative'],
      controls: [
        {
          name: 'a',
          label: 'A',
          value: false,
          types: ['boolean']
        },
        {
          name: 'b',
          label: 'B',
          value: false,
          types: ['boolean']
        },
        {
          name: 'aOrB',
          label: 'A OR B',
          value: false,
          types: ['boolean'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/google-translate',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Google Translate',
      description: 'Translate content between languages using the Google Cloud Translation API',
      url: 'https://ciphereditor.com/explore/google-translate',
      keywords: ['english', 'german', 'spanish', 'french'],
      controls: [
        {
          name: 'source',
          value: 'Hello, World.',
          types: ['text']
        },
        {
          name: 'sourceLanguage',
          value: 'en',
          types: ['text'],
          options: [
            { value: '', label: 'Detect' },
            { value: 'af', label: 'Afrikaans' },
            { value: 'sq', label: 'Albanian' },
            { value: 'am', label: 'Amharic' },
            { value: 'ar', label: 'Arabic' },
            { value: 'hy', label: 'Armenian' },
            { value: 'az', label: 'Azerbaijani' },
            { value: 'eu', label: 'Basque' },
            { value: 'be', label: 'Belarusian' },
            { value: 'bn', label: 'Bengali' },
            { value: 'bs', label: 'Bosnian' },
            { value: 'bg', label: 'Bulgarian' },
            { value: 'ca', label: 'Catalan' },
            { value: 'ceb', label: 'Cebuano' },
            { value: 'zh-CN', label: 'Chinese (Simplified)' },
            { value: 'zh-TW', label: 'Chinese (Traditional)' },
            { value: 'co', label: 'Corsican' },
            { value: 'hr', label: 'Croatian' },
            { value: 'cs', label: 'Czech' },
            { value: 'da', label: 'Danish' },
            { value: 'nl', label: 'Dutch' },
            { value: 'en', label: 'English' },
            { value: 'eo', label: 'Esperanto' },
            { value: 'et', label: 'Estonian' },
            { value: 'fi', label: 'Finnish' },
            { value: 'fr', label: 'French' },
            { value: 'fy', label: 'Frisian' },
            { value: 'gl', label: 'Galician' },
            { value: 'ka', label: 'Georgian' },
            { value: 'de', label: 'German' },
            { value: 'el', label: 'Greek' },
            { value: 'gu', label: 'Gujarati' },
            { value: 'ht', label: 'Haitian Creole' },
            { value: 'ha', label: 'Hausa' },
            { value: 'haw', label: 'Hawaiian' },
            { value: 'he or iw', label: 'Hebrew' },
            { value: 'hi', label: 'Hindi' },
            { value: 'hmn', label: 'Hmong' },
            { value: 'hu', label: 'Hungarian' },
            { value: 'is', label: 'Icelandic' },
            { value: 'ig', label: 'Igbo' },
            { value: 'id', label: 'Indonesian' },
            { value: 'ga', label: 'Irish' },
            { value: 'it', label: 'Italian' },
            { value: 'ja', label: 'Japanese' },
            { value: 'jv', label: 'Javanese' },
            { value: 'kn', label: 'Kannada' },
            { value: 'kk', label: 'Kazakh' },
            { value: 'km', label: 'Khmer' },
            { value: 'rw', label: 'Kinyarwanda' },
            { value: 'ko', label: 'Korean' },
            { value: 'ku', label: 'Kurdish' },
            { value: 'ky', label: 'Kyrgyz' },
            { value: 'lo', label: 'Lao' },
            { value: 'lv', label: 'Latvian' },
            { value: 'lt', label: 'Lithuanian' },
            { value: 'lb', label: 'Luxembourgish' },
            { value: 'mk', label: 'Macedonian' },
            { value: 'mg', label: 'Malagasy' },
            { value: 'ms', label: 'Malay' },
            { value: 'ml', label: 'Malayalam' },
            { value: 'mt', label: 'Maltese' },
            { value: 'mi', label: 'Maori' },
            { value: 'mr', label: 'Marathi' },
            { value: 'mn', label: 'Mongolian' },
            { value: 'my', label: 'Myanmar (Burmese)' },
            { value: 'ne', label: 'Nepali' },
            { value: 'no', label: 'Norwegian' },
            { value: 'ny', label: 'Nyanja (Chichewa)' },
            { value: 'or', label: 'Odia (Oriya)' },
            { value: 'ps', label: 'Pashto' },
            { value: 'fa', label: 'Persian' },
            { value: 'pl', label: 'Polish' },
            { value: 'pt', label: 'Portuguese (Portugal, Brazil)' },
            { value: 'pa', label: 'Punjabi' },
            { value: 'ro', label: 'Romanian' },
            { value: 'ru', label: 'Russian' },
            { value: 'sm', label: 'Samoan' },
            { value: 'gd', label: 'Scots Gaelic' },
            { value: 'sr', label: 'Serbian' },
            { value: 'st', label: 'Sesotho' },
            { value: 'sn', label: 'Shona' },
            { value: 'sd', label: 'Sindhi' },
            { value: 'si', label: 'Sinhala (Sinhalese)' },
            { value: 'sk', label: 'Slovak' },
            { value: 'sl', label: 'Slovenian' },
            { value: 'so', label: 'Somali' },
            { value: 'es', label: 'Spanish' },
            { value: 'su', label: 'Sundanese' },
            { value: 'sw', label: 'Swahili' },
            { value: 'sv', label: 'Swedish' },
            { value: 'tl', label: 'Tagalog (Filipino)' },
            { value: 'tg', label: 'Tajik' },
            { value: 'ta', label: 'Tamil' },
            { value: 'tt', label: 'Tatar' },
            { value: 'te', label: 'Telugu' },
            { value: 'th', label: 'Thai' },
            { value: 'tr', label: 'Turkish' },
            { value: 'tk', label: 'Turkmen' },
            { value: 'uk', label: 'Ukrainian' },
            { value: 'ur', label: 'Urdu' },
            { value: 'ug', label: 'Uyghur' },
            { value: 'uz', label: 'Uzbek' },
            { value: 'vi', label: 'Vietnamese' },
            { value: 'cy', label: 'Welsh' },
            { value: 'xh', label: 'Xhosa' },
            { value: 'yi', label: 'Yiddish' },
            { value: 'yo', label: 'Yoruba' },
            { value: 'zu', label: 'Zulu' }
          ]
        },
        {
          name: 'targetLanguage',
          value: 'de',
          types: ['text'],
          options: [
            { value: '', label: 'Detect' },
            { value: 'af', label: 'Afrikaans' },
            { value: 'sq', label: 'Albanian' },
            { value: 'am', label: 'Amharic' },
            { value: 'ar', label: 'Arabic' },
            { value: 'hy', label: 'Armenian' },
            { value: 'az', label: 'Azerbaijani' },
            { value: 'eu', label: 'Basque' },
            { value: 'be', label: 'Belarusian' },
            { value: 'bn', label: 'Bengali' },
            { value: 'bs', label: 'Bosnian' },
            { value: 'bg', label: 'Bulgarian' },
            { value: 'ca', label: 'Catalan' },
            { value: 'ceb', label: 'Cebuano' },
            { value: 'zh-CN', label: 'Chinese (Simplified)' },
            { value: 'zh-TW', label: 'Chinese (Traditional)' },
            { value: 'co', label: 'Corsican' },
            { value: 'hr', label: 'Croatian' },
            { value: 'cs', label: 'Czech' },
            { value: 'da', label: 'Danish' },
            { value: 'nl', label: 'Dutch' },
            { value: 'en', label: 'English' },
            { value: 'eo', label: 'Esperanto' },
            { value: 'et', label: 'Estonian' },
            { value: 'fi', label: 'Finnish' },
            { value: 'fr', label: 'French' },
            { value: 'fy', label: 'Frisian' },
            { value: 'gl', label: 'Galician' },
            { value: 'ka', label: 'Georgian' },
            { value: 'de', label: 'German' },
            { value: 'el', label: 'Greek' },
            { value: 'gu', label: 'Gujarati' },
            { value: 'ht', label: 'Haitian Creole' },
            { value: 'ha', label: 'Hausa' },
            { value: 'haw', label: 'Hawaiian' },
            { value: 'he or iw', label: 'Hebrew' },
            { value: 'hi', label: 'Hindi' },
            { value: 'hmn', label: 'Hmong' },
            { value: 'hu', label: 'Hungarian' },
            { value: 'is', label: 'Icelandic' },
            { value: 'ig', label: 'Igbo' },
            { value: 'id', label: 'Indonesian' },
            { value: 'ga', label: 'Irish' },
            { value: 'it', label: 'Italian' },
            { value: 'ja', label: 'Japanese' },
            { value: 'jv', label: 'Javanese' },
            { value: 'kn', label: 'Kannada' },
            { value: 'kk', label: 'Kazakh' },
            { value: 'km', label: 'Khmer' },
            { value: 'rw', label: 'Kinyarwanda' },
            { value: 'ko', label: 'Korean' },
            { value: 'ku', label: 'Kurdish' },
            { value: 'ky', label: 'Kyrgyz' },
            { value: 'lo', label: 'Lao' },
            { value: 'lv', label: 'Latvian' },
            { value: 'lt', label: 'Lithuanian' },
            { value: 'lb', label: 'Luxembourgish' },
            { value: 'mk', label: 'Macedonian' },
            { value: 'mg', label: 'Malagasy' },
            { value: 'ms', label: 'Malay' },
            { value: 'ml', label: 'Malayalam' },
            { value: 'mt', label: 'Maltese' },
            { value: 'mi', label: 'Maori' },
            { value: 'mr', label: 'Marathi' },
            { value: 'mn', label: 'Mongolian' },
            { value: 'my', label: 'Myanmar (Burmese)' },
            { value: 'ne', label: 'Nepali' },
            { value: 'no', label: 'Norwegian' },
            { value: 'ny', label: 'Nyanja (Chichewa)' },
            { value: 'or', label: 'Odia (Oriya)' },
            { value: 'ps', label: 'Pashto' },
            { value: 'fa', label: 'Persian' },
            { value: 'pl', label: 'Polish' },
            { value: 'pt', label: 'Portuguese (Portugal, Brazil)' },
            { value: 'pa', label: 'Punjabi' },
            { value: 'ro', label: 'Romanian' },
            { value: 'ru', label: 'Russian' },
            { value: 'sm', label: 'Samoan' },
            { value: 'gd', label: 'Scots Gaelic' },
            { value: 'sr', label: 'Serbian' },
            { value: 'st', label: 'Sesotho' },
            { value: 'sn', label: 'Shona' },
            { value: 'sd', label: 'Sindhi' },
            { value: 'si', label: 'Sinhala (Sinhalese)' },
            { value: 'sk', label: 'Slovak' },
            { value: 'sl', label: 'Slovenian' },
            { value: 'so', label: 'Somali' },
            { value: 'es', label: 'Spanish' },
            { value: 'su', label: 'Sundanese' },
            { value: 'sw', label: 'Swahili' },
            { value: 'sv', label: 'Swedish' },
            { value: 'tl', label: 'Tagalog (Filipino)' },
            { value: 'tg', label: 'Tajik' },
            { value: 'ta', label: 'Tamil' },
            { value: 'tt', label: 'Tatar' },
            { value: 'te', label: 'Telugu' },
            { value: 'th', label: 'Thai' },
            { value: 'tr', label: 'Turkish' },
            { value: 'tk', label: 'Turkmen' },
            { value: 'uk', label: 'Ukrainian' },
            { value: 'ur', label: 'Urdu' },
            { value: 'ug', label: 'Uyghur' },
            { value: 'uz', label: 'Uzbek' },
            { value: 'vi', label: 'Vietnamese' },
            { value: 'cy', label: 'Welsh' },
            { value: 'xh', label: 'Xhosa' },
            { value: 'yi', label: 'Yiddish' },
            { value: 'yo', label: 'Yoruba' },
            { value: 'zu', label: 'Zulu' }
          ]
        },
        {
          name: 'target',
          value: 'Hallo Welt.',
          types: ['text'],
          order: 1000
        }
      ],
      timeout: 20000
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/word-counter',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Word counter',
      description: 'Operation for counting the number of characters, words and lines that appear in a text.',
      url: 'https://ciphereditor.com/explore/word-counter',
      keywords: [],
      controls: [
        {
          name: 'text',
          value: 'The quick brown fox jumps over the lazy dog.',
          types: ['text']
        },
        {
          name: 'characterCount',
          value: 44,
          types: ['integer'],
          writable: false,
          order: 1000
        },
        {
          name: 'wordCount',
          value: 9,
          types: ['integer'],
          writable: false,
          order: 1000
        },
        {
          name: 'lineCount',
          value: 1,
          types: ['integer'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/case-transform',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Case transform',
      description: 'Transform text to lower case, upper case, capitalize, alternating case or inverse case',
      keywords: [],
      controls: [
        {
          name: 'source',
          value: 'Hello World',
          types: ['text']
        },
        {
          name: 'transform',
          value: 'upperCase',
          types: ['text'],
          options: [
            { value: 'lowerCase', label: 'Lower case' },
            { value: 'upperCase', label: 'Upper case' },
            { value: 'capitalize', label: 'Capitalize' },
            { value: 'alternatingCase', label: 'Alternating case' },
            { value: 'inverseCase', label: 'Inverse case' }
          ]
        },
        {
          name: 'transformed',
          value: 'HELLO WORLD',
          types: ['text'],
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/concatenate',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Concatenate',
      description: 'Concatenate text or byte inputs',
      keywords: ['append', 'join'],
      controls: [
        {
          name: 'a',
          label: 'A',
          value: 'foo',
          types: ['text', 'bytes']
        },
        {
          name: 'b',
          label: 'B',
          value: 'bar',
          types: ['text', 'bytes']
        },
        {
          name: 'ab',
          label: 'AB',
          value: 'foobar',
          types: ['text', 'bytes'],
          writable: false,
          order: 1000
        }
      ]
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-essentials/reverser',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Reverser',
      description: 'Reverse (or flip) characters or bytes',
      keywords: ['flip'],
      controls: [
        {
          name: 'data',
          value: 'ciphereditor',
          types: ['text', 'bytes']
        },
        {
          name: 'transformedData',
          value: 'rotiderehpic',
          types: ['text', 'bytes'],
          order: 1000
        }
      ]
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
