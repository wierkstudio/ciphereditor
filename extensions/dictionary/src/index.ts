
import morseCodeDictionary from './dictionaries/morse-code.json'
import navajoCodeDictionary from './dictionaries/navajo-code.json'
import phoneticAlphabetDictionary from './dictionaries/phonetic-alphabet.json'
import { ExtensionActivateExport } from '@ciphereditor/library'
import { createDictionaryContribution } from './lib/translator'

const defaultInitialSource = 'the quick brown fox jumps over the lazy dog'

export const activate: ExtensionActivateExport = (context) => [
  createDictionaryContribution(context, {
    name: '@ciphereditor/extension-dictionary/morse-code',
    label: 'Morse code',
    description: 'Morse code is a method of transmitting text information as a series of on-off tones, lights, or clicks.',
    url: 'https://ciphereditor.com/explore/morse-code-translator',
    keywords: ['sos', 'telegraph'],
    dictionary: morseCodeDictionary,
    initialSource: defaultInitialSource
  }),
  createDictionaryContribution(context, {
    name: '@ciphereditor/extension-dictionary/navajo-code',
    label: 'Navajo code',
    description: 'Navajo Code talkers use the little-known Native American language Navajo as a mean of secret communication.',
    url: 'https://ciphereditor.com/explore/navajo-code-talkers',
    keywords: ['talkers'],
    dictionary: navajoCodeDictionary,
    initialSource: defaultInitialSource
  }),
  createDictionaryContribution(context, {
    name: '@ciphereditor/extension-dictionary/phonetic-alphabet',
    label: 'Phonetic alphabet',
    description: 'A phonetic alphabet or spelling alphabet is a set of words used to spell out letters in oral communication.',
    url: 'https://ciphereditor.com/explore/nato-phonetic-alphabet',
    keywords: ['international', 'nato', 'dutch', 'finnish', 'french', 'german', 'italian', 'korean', 'polish', 'portuguese', 'spanish', 'swedish', 'turkish'],
    dictionary: phoneticAlphabetDictionary,
    initialSource: defaultInitialSource
  })
]
