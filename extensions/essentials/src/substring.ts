
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/string'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/substring',
  label: 'Substring',
  description: 'Extract a portion of a text that begins at a zero-based start index and ends before a zero-based end index. Negative indices may be used to indicate offsets from the end of the text.',
  keywords: ['trim', 'extract', 'slice'],
  controls: [
    {
      name: 'string',
      value: 'the quick brown fox jumps over the lazy dog',
      types: ['text']
    },
    {
      name: 'start',
      value: 10,
      types: ['integer']
    },
    {
      name: 'end',
      value: 19,
      types: ['integer']
    },
    {
      name: 'substring',
      value: 'brown fox',
      types: ['text'],
      order: 1000,
      writable: false
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const string = request.values.string as string
  const start = request.values.start as number
  const end = request.values.end as number

  const chars = stringToUnicodeCodePoints(string)
  const substringChars = chars.slice(start, end)
  const substring = stringFromUnicodeCodePoints(substringChars)

  return { changes: [{ name: 'substring', value: substring }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
