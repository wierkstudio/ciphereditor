
import morseCodeDictionary from './dictionaries/morse-code.json'
import navajoCodeDictionary from './dictionaries/navajo-code.json'
import phoneticAlphabetDictionary from './dictionaries/phonetic-alphabet.json'
import tapCodeDictionary from './dictionaries/tap-code.json'
import { ExtensionActivateExport } from '@ciphereditor/library'
import { createDictionaryContribution } from './lib/translator'

export const activate: ExtensionActivateExport = (context) => [
  createDictionaryContribution(context, {
    dictionary: morseCodeDictionary,
    name: '@ciphereditor/extension-dictionary/morse-code',
    label: 'Morse code',
    description: '(work in progress)',
    url: 'https://ciphereditor.com/explore/morse-code-translator',
    keywords: []
  }),
  createDictionaryContribution(context, {
    dictionary: navajoCodeDictionary,
    name: '@ciphereditor/extension-dictionary/navajo-code',
    label: 'Navajo code',
    description: '(work in progress)',
    url: 'https://ciphereditor.com/explore/navajo-code-talkers',
    keywords: []
  }),
  createDictionaryContribution(context, {
    dictionary: phoneticAlphabetDictionary,
    name: '@ciphereditor/extension-dictionary/phonetic-alphabet',
    label: 'Phonetic alphabet',
    description: '(work in progress)',
    url: 'https://ciphereditor.com/explore/nato-phonetic-alphabet',
    keywords: []
  }),
  createDictionaryContribution(context, {
    dictionary: tapCodeDictionary,
    name: '@ciphereditor/extension-dictionary/tap-code',
    label: 'Tap code',
    description: '(work in progress)',
    url: 'https://ciphereditor.com/explore/tap-code-translator',
    keywords: ['knock']
  })
]
