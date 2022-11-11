
import { CodePage, codePageLabelMap } from './lib/code-pages'
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import cptable from 'codepage'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-codepages/text-encoder',
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
      options: Object.entries(codePageLabelMap)
        .map(([value, label]) => ({ value, label }))
    },
    {
      name: 'bytes',
      value: { type: 'bytes', data: 'Y2lwaGVyZWRpdG9y' },
      types: ['bytes'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = async (request) => {
  const { controlPriorities, values } = request
  const codePage = values.encoding as CodePage
  const encode =
    controlPriorities.indexOf('text') <
    controlPriorities.indexOf('bytes')

  if (encode) {
    const text = values.text as string
    const rawResult = cptable.utils.encode(codePage, text)
    if (typeof rawResult === 'string') {
      throw new Error('Logic error: Unexpected encode result type string.')
    }
    const bytes = new Uint8Array(rawResult)
    return { changes: [{ name: 'bytes', value: bytes.buffer }] }
  } else {
    const bytes = values.bytes as ArrayBuffer
    const text = cptable.utils.decode(codePage, new Uint8Array(bytes))
    return { changes: [{ name: 'text', value: text }] }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
