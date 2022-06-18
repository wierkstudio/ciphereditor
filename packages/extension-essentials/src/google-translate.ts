
import { Contribution, NamedControlChange, OperationExecuteExport } from '@ciphereditor/types'

// TODO: Create proxy service with rate limiting and origin check
const apiKey = 'REDACTED'
const apiEndpointUrl = 'https://translation.googleapis.com/language/translate/v2'

const languageOptions = [
  ['Afrikaans', 'af'],
  ['Albanian', 'sq'],
  ['Amharic', 'am'],
  ['Arabic', 'ar'],
  ['Armenian', 'hy'],
  ['Azerbaijani', 'az'],
  ['Basque', 'eu'],
  ['Belarusian', 'be'],
  ['Bengali', 'bn'],
  ['Bosnian', 'bs'],
  ['Bulgarian', 'bg'],
  ['Catalan', 'ca'],
  ['Cebuano', 'ceb'],
  ['Chinese (Simplified)', 'zh-CN'],
  ['Chinese (Traditional)', 'zh-TW'],
  ['Corsican', 'co'],
  ['Croatian', 'hr'],
  ['Czech', 'cs'],
  ['Danish', 'da'],
  ['Dutch', 'nl'],
  ['English', 'en'],
  ['Esperanto', 'eo'],
  ['Estonian', 'et'],
  ['Finnish', 'fi'],
  ['French', 'fr'],
  ['Frisian', 'fy'],
  ['Galician', 'gl'],
  ['Georgian', 'ka'],
  ['German', 'de'],
  ['Greek', 'el'],
  ['Gujarati', 'gu'],
  ['Haitian Creole', 'ht'],
  ['Hausa', 'ha'],
  ['Hawaiian', 'haw'],
  ['Hebrew', 'he or iw'],
  ['Hindi', 'hi'],
  ['Hmong', 'hmn'],
  ['Hungarian', 'hu'],
  ['Icelandic', 'is'],
  ['Igbo', 'ig'],
  ['Indonesian', 'id'],
  ['Irish', 'ga'],
  ['Italian', 'it'],
  ['Japanese', 'ja'],
  ['Javanese', 'jv'],
  ['Kannada', 'kn'],
  ['Kazakh', 'kk'],
  ['Khmer', 'km'],
  ['Kinyarwanda', 'rw'],
  ['Korean', 'ko'],
  ['Kurdish', 'ku'],
  ['Kyrgyz', 'ky'],
  ['Lao', 'lo'],
  ['Latvian', 'lv'],
  ['Lithuanian', 'lt'],
  ['Luxembourgish', 'lb'],
  ['Macedonian', 'mk'],
  ['Malagasy', 'mg'],
  ['Malay', 'ms'],
  ['Malayalam', 'ml'],
  ['Maltese', 'mt'],
  ['Maori', 'mi'],
  ['Marathi', 'mr'],
  ['Mongolian', 'mn'],
  ['Myanmar (Burmese)', 'my'],
  ['Nepali', 'ne'],
  ['Norwegian', 'no'],
  ['Nyanja (Chichewa)', 'ny'],
  ['Odia (Oriya)', 'or'],
  ['Pashto', 'ps'],
  ['Persian', 'fa'],
  ['Polish', 'pl'],
  ['Portuguese (Portugal, Brazil)', 'pt'],
  ['Punjabi', 'pa'],
  ['Romanian', 'ro'],
  ['Russian', 'ru'],
  ['Samoan', 'sm'],
  ['Scots Gaelic', 'gd'],
  ['Serbian', 'sr'],
  ['Sesotho', 'st'],
  ['Shona', 'sn'],
  ['Sindhi', 'sd'],
  ['Sinhala (Sinhalese)', 'si'],
  ['Slovak', 'sk'],
  ['Slovenian', 'sl'],
  ['Somali', 'so'],
  ['Spanish', 'es'],
  ['Sundanese', 'su'],
  ['Swahili', 'sw'],
  ['Swedish', 'sv'],
  ['Tagalog (Filipino)', 'tl'],
  ['Tajik', 'tg'],
  ['Tamil', 'ta'],
  ['Tatar', 'tt'],
  ['Telugu', 'te'],
  ['Thai', 'th'],
  ['Turkish', 'tr'],
  ['Turkmen', 'tk'],
  ['Ukrainian', 'uk'],
  ['Urdu', 'ur'],
  ['Uyghur', 'ug'],
  ['Uzbek', 'uz'],
  ['Vietnamese', 'vi'],
  ['Welsh', 'cy'],
  ['Xhosa', 'xh'],
  ['Yiddish', 'yi'],
  ['Yoruba', 'yo'],
  ['Zulu', 'zu']
]
  .map(entry => ({ value: entry[1], label: entry[0] }))

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/operation-essentials/google-translate',
  label: 'Google Translate',
  controls: [
    {
      // TODO: Limit length
      name: 'source',
      initialValue: 'Hello, World.',
      types: ['text']
    },
    {
      name: 'sourceLanguage',
      initialValue: 'en',
      types: ['text'],
      choices: languageOptions
    },
    {
      name: 'targetLanguage',
      initialValue: 'de',
      types: ['text'],
      choices: languageOptions
    },
    {
      // TODO: Limit length
      name: 'target',
      initialValue: 'Hallo Welt.',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = async (request) => {
  const { values, controlPriorities } = request

  const forward = controlPriorities.indexOf('source') < controlPriorities.indexOf('target')

  const textControl = forward ? 'source' : 'target'
  const sourceControl = forward ? 'sourceLanguage' : 'targetLanguage'
  const targetControl = forward ? 'targetLanguage' : 'sourceLanguage'

  const text = values[textControl].data as string
  const source = values[sourceControl].data as string
  const target = values[targetControl].data as string

  if (target === '') {
    return {
      issues: [{
        type: 'error',
        controlName: targetControl,
        message: 'The target language cannot be detected'
      }]
    }
  }

  const params = new URLSearchParams({
    q: text,
    source,
    target,
    format: 'text',
    key: apiKey
  })

  const url = apiEndpointUrl + '?' + params.toString()
  let detectedSource = null
  let translatedText = null

  try {
    const response = await fetch(url)
    const data = await response.json()
    detectedSource = data.data.translations[0].detectedSourceLanguage
    translatedText = data.data.translations[0].translatedText
  } catch (err: any) {
    return {
      issues: [{
        type: 'error',
        message: 'Error while contacting the Google Translate service',
        description: 'Please check your internet connection or try again later'
      }]
    }
  }

  const changes: NamedControlChange[] = []
  changes.push({
    name: forward ? 'target' : 'source',
    value: translatedText
  })

  if (source === '') {
    changes.push({
      name: forward ? 'sourceLanguage' : 'targetLanguage',
      value: detectedSource
    })
  }

  // TODO: Remove this cooldown and move it to the backend
  await new Promise(resolve => setTimeout(resolve, 500))

  return { changes }
}

export default {
  contribution,
  body: {
    execute
  }
}
