
import { createSlice } from '@reduxjs/toolkit'
import { DirectoryState } from 'types/directory'

const defaultDirectoryState: DirectoryState = {
  operations: [
    {
      name: 'cryptii/translate',
      label: 'Translate',
      controls: [
        {
          name: 'language1',
          initialValue: 'en',
          types: ['text'],
        },
        {
          name: 'text1',
          initialValue: 'Hello, World.',
          types: ['text'],
        },
        {
          name: 'language2',
          initialValue: 'de',
          types: ['text'],
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
          enum: [
            ['rot5', 'text', 'ROT5 (0-9)'],
            ['rot13', 'text', 'ROT13 (A-Z, a-z)'],
            ['rot18', 'text', 'ROT18 (0-9, A-Z, a-z)'],
            ['rot47', 'text', 'ROT47 (!-~)'],
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
        },
        {
          name: 'paddingSymbol',
          initialValue: '=',
          types: ['text'],
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
        },
        {
          name: 'lineSeparator',
          initialValue: '\r\n',
          types: ['text'],
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
