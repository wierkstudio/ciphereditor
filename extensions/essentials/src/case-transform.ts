
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/unicode'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/case-transform',
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
}

const reversableTransforms = ['inverseCase']

const execute: OperationExecuteExport = (request) => {
  const source = request.values.source as string
  const transform = request.values.transform as string
  const transformed = request.values.transformed as string

  const controlPriorities = request.controlPriorities
  const forward = controlPriorities.indexOf('source') < controlPriorities.indexOf('transformed')
  const input = forward ? source : transformed
  const outputControl = forward ? 'transformed' : 'source'

  if (forward || reversableTransforms.includes(transform)) {
    const output = transformCase(input, transform)
    return { changes: [{ name: outputControl, value: output }] }
  }

  return { changes: [{ name: outputControl, value: input }] }
}

const transformCase = (string: string, transform: string): string => {
  switch (transform) {
    case 'lowerCase': {
      return string.toLowerCase()
    }
    case 'upperCase': {
      return string.toUpperCase()
    }
    case 'capitalize': {
      return string.replace(/\w\S*/ug, word =>
        word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
    }
    case 'alternatingCase': {
      return (
        stringToUnicodeCodePoints(string)
          .map((codePoint, index) => {
            const char = stringFromUnicodeCodePoints([codePoint])
            return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          })
          .join('')
      )
    }
    case 'inverseCase': {
      return (
        stringToUnicodeCodePoints(string)
          .map((codePoint) => {
            const char = stringFromUnicodeCodePoints([codePoint])
            const lowerCaseChar = char.toLowerCase()
            return char !== lowerCaseChar ? lowerCaseChar : char.toUpperCase()
          })
          .join('')
      )
    }
    default: {
      return string
    }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
