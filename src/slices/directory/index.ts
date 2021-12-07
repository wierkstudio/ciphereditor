
import { createSlice } from '@reduxjs/toolkit'
import { DirectoryState } from 'types/directory'

const defaultDirectoryState: DirectoryState = {
  operations: [
    {
      name: 'cryptii/translate',
      label: 'Translate',
      controls: [
        {
          name: 'text1',
          initialValue: 'Hello, World.',
          types: ['text'],
        },
        {
          name: 'language1',
          initialValue: 'en',
          types: ['text'],
          options: [
            { value: '', label: 'Detect' },
            { value: 'en', label: 'English' },
            { value: 'de', label: 'German' },
            { value: 'fr', label: 'French' },
            { value: 'no', label: 'Norwegian' },
            { value: 'lb', label: 'Luxembourgish' },
          ],
        },
        {
          name: 'language2',
          initialValue: 'de',
          types: ['text'],
          options: [
            { value: '', label: 'Detect' },
            { value: 'en', label: 'English' },
            { value: 'de', label: 'German' },
            { value: 'fr', label: 'French' },
            { value: 'no', label: 'Norwegian' },
            { value: 'lb', label: 'Luxembourgish' },
          ],
        },
        {
          name: 'text2',
          initialValue: 'Hallo Welt.',
          types: ['text'],
        },
      ],
      bundleUrl: 'https://localhost:3000/bundle-essentials.js',
      moduleId: 'translate',
    },
    {
      name: 'cryptii/rot13',
      label: 'ROT13',
      controls: [
        {
          name: 'plaintext',
          initialValue: 'The quick brown fox jumps over the lazy dog.',
          types: ['text'],
        },
        {
          name: 'variant',
          initialValue: 'rot13',
          types: ['text'],
          options: [
            { value: 'rot5', label: 'ROT5 (0-9)' },
            { value: 'rot13', label: 'ROT13 (A-Z, a-z)' },
            { value: 'rot18', label: 'ROT18 (0-9, A-Z, a-z)' },
            { value: 'rot47', label: 'ROT47 (!-~)' },
          ],
        },
        {
          name: 'ciphertext',
          initialValue: 'Gur dhvpx oebja sbk whzcf bire gur ynml qbt.',
          types: ['text'],
        },
      ],
      bundleUrl: 'https://localhost:3000/bundle-essentials.js',
      moduleId: 'rot13',
    },
    {
      name: 'cryptii/basen',
      label: 'BaseN',
      controls: [
        {
          name: 'data',
          initialValue: 'The quick brown fox jumps over the lazy dog.',
          types: ['bytes', 'text'],
        },
        {
          name: 'alphabet',
          initialValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
          types: ['text'],
          options: [
            { value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', label: 'Base32' },
            { value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', label: 'Base64' },
          ],
          enforceOptions: false,
        },
        {
          name: 'paddingSymbol',
          initialValue: '=',
          types: ['text'],
          options: [
            { value: '', label: 'None' },
            { value: '=', label: 'Equals sign (=)' },
          ],
          enforceOptions: false,
        },
        {
          name: 'paddingRequired',
          initialValue: false,
          types: ['boolean'],
        },
        {
          name: 'maxLineLength',
          initialValue: 0,
          types: ['integer'],
          options: [
            { value: 0, label: 'None' },
            { value: 64, label: '64 (RFC 1421)' },
            { value: 76, label: '76 (RFC 2045)' },
          ],
          enforceOptions: false,
        },
        {
          name: 'lineSeparator',
          initialValue: '\r\n',
          types: ['text'],
          options: [
            { value: '\r\n', label: 'CR & LF' },
            { value: '\n', label: 'LF' },
          ],
          enforceOptions: false,
        },
        {
          name: 'encodedData',
          initialValue: 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4=',
          types: ['text'],
        },
      ],
      bundleUrl: 'https://localhost:3000/bundle-essentials.js',
      moduleId: 'basen',
    }
  ]
}

export const directorySlice = createSlice({
  name: 'directory',
  initialState: defaultDirectoryState,
  reducers: {}
})

export const {
} = directorySlice.actions

export default directorySlice.reducer
