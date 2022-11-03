
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
      url: 'https://ciphereditor.com/operations/caesar-cipher',
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
      url: 'https://ciphereditor.com/operations/rot13',
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
      name: '@ciphereditor/extension-essentials/letter-number-cipher',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Letter number cipher',
      description: 'Method in which each letter in a text is replaced by the corresponding position in the alphabet.',
      url: 'https://ciphereditor.com/operations/letter-number-cipher',
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
      name: '@ciphereditor/extension-essentials/word-counter',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Word counter',
      description: 'Operation for counting the number of characters, words and lines that appear in a text.',
      url: 'https://ciphereditor.com/operations/word-counter',
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
      name: '@ciphereditor/extension-essentials/binary-to-text',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Binary to text encoding',
      description: 'Operation for commonly used base64, base32, base16, hex, and binary encoding schemes.',
      url: 'https://ciphereditor.com/operations/binary-to-text',
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
      name: '@ciphereditor/extension-hash/hash',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-hash/1.0.0-alpha.1/extension.js',
      label: 'Hash function',
      description: 'Map data of arbitrary size to hashes of fixed size',
      url: 'https://ciphereditor.com/operations/cryptographic-hash-function',
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
      url: 'https://ciphereditor.com/operations/hmac',
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
      name: '@ciphereditor/extension-essentials/logical-not',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-essentials/1.0.0-alpha.1/extension.js',
      label: 'Logical NOT',
      description: 'Takes truth to falsity and vice versa',
      url: 'https://ciphereditor.com/operations/logical-and-or-not',
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
      url: 'https://ciphereditor.com/operations/logical-and-or-not',
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
      url: 'https://ciphereditor.com/operations/logical-and-or-not',
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
      url: 'https://ciphereditor.com/operations/google-translate',
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
      name: '@ciphereditor/extension-pgp/encryption',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-pgp/1.0.0-alpha.1/extension.js?v=1',
      label: 'PGP Encryption',
      description: 'Apply OpenPGP encryption and decryption on text or binary messages',
      url: 'https://ciphereditor.com/operations/pgp-encryption',
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
    },
    {
      type: 'operation',
      name: '@ciphereditor/extension-pgp/inspect-key',
      extensionUrl: 'https://cdn.ciphereditor.com/extensions/@ciphereditor/extension-pgp/1.0.0-alpha.1/extension.js?v=1',
      label: 'Inspect PGP Key',
      description: 'Inspect a given PGP key to reveal its type and fingerprint among other facts',
      url: 'https://ciphereditor.com/operations/pgp-encryption',
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
