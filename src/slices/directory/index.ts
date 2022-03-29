
import { createSlice } from '@reduxjs/toolkit'
import { DirectoryState } from './types'

const processorUrl = process.env.REACT_APP_PROCESSOR_URL ?? './processor/'

const defaultDirectoryState: DirectoryState = {
  operations: [
    {
      name: 'cryptii/translate',
      label: 'Translate',
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
            { value: 'en', label: 'English' },
            { value: 'de', label: 'German' },
            { value: 'fr', label: 'French' },
            { value: 'no', label: 'Norwegian' },
            { value: 'lb', label: 'Luxembourgish' }
          ]
        },
        {
          name: 'targetLanguage',
          initialValue: 'de',
          types: ['text'],
          choices: [
            { value: '', label: 'Detect' },
            { value: 'en', label: 'English' },
            { value: 'de', label: 'German' },
            { value: 'fr', label: 'French' },
            { value: 'no', label: 'Norwegian' },
            { value: 'lb', label: 'Luxembourgish' }
          ]
        },
        {
          name: 'target',
          initialValue: 'Hallo Welt.',
          types: ['text']
        }
      ],
      bundleUrl: processorUrl + 'bundle-essentials.js',
      moduleId: 'translate'
    },
    {
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
          types: ['text']
        }
      ],
      bundleUrl: processorUrl + 'bundle-essentials.js',
      moduleId: 'rot13'
    },
    {
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
          types: ['text']
        }
      ],
      bundleUrl: processorUrl + 'bundle-essentials.js',
      moduleId: 'caesar-cipher'
    },
    {
      name: 'cryptii/basen',
      label: 'BaseN',
      controls: [
        {
          name: 'data',
          initialValue: 'The quick brown fox jumps over the lazy dog.',
          types: ['bytes', 'text']
        },
        {
          name: 'alphabet',
          initialValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
          types: ['text'],
          choices: [
            { value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', label: 'Base32' },
            { value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', label: 'Base64' }
          ],
          enforceChoices: false
        },
        {
          name: 'paddingSymbol',
          initialValue: '=',
          types: ['text'],
          choices: [
            { value: '', label: 'None' },
            { value: '=', label: 'Equals sign (=)' }
          ],
          enforceChoices: false
        },
        {
          name: 'paddingRequired',
          initialValue: false,
          types: ['boolean']
        },
        {
          name: 'maxLineLength',
          initialValue: { value: 0, type: 'integer' },
          types: ['integer'],
          choices: [
            { value: { value: 0, type: 'integer' }, label: 'None' },
            { value: { value: 64, type: 'integer' }, label: '64 (RFC 1421)' },
            { value: { value: 76, type: 'integer' }, label: '76 (RFC 2045)' }
          ],
          enforceChoices: false
        },
        {
          name: 'lineSeparator',
          initialValue: '\r\n',
          types: ['text'],
          choices: [
            { value: '\r\n', label: 'CR & LF' },
            { value: '\n', label: 'LF' }
          ],
          enforceChoices: false
        },
        {
          name: 'encodedData',
          initialValue: 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=',
          types: ['text']
        }
      ],
      bundleUrl: processorUrl + 'bundle-essentials.js',
      moduleId: 'basen'
    },
    {
      name: 'cryptii/word-counter',
      label: 'Word Counter',
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
          writable: false
        },
        {
          name: 'wordCount',
          initialValue: 9,
          types: ['integer'],
          writable: false
        },
        {
          name: 'lineCount',
          initialValue: 1,
          types: ['integer'],
          writable: false
        }
      ],
      bundleUrl: processorUrl + 'bundle-essentials.js',
      moduleId: 'word-counter'
    },
    {
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
          types: ['boolean']
        }
      ],
      bundleUrl: processorUrl + 'bundle-essentials.js',
      moduleId: 'logical-not'
    },
    {
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
          writable: false
        }
      ],
      bundleUrl: processorUrl + 'bundle-essentials.js',
      moduleId: 'logical-and'
    },
    {
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
          writable: false
        }
      ],
      bundleUrl: processorUrl + 'bundle-essentials.js',
      moduleId: 'logical-or'
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
