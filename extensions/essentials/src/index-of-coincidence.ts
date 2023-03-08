
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { stringToUnicodeCodePoints, whitespaceCodePoints } from './lib/unicode'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/index-of-coincidence',
  label: 'Index of coincidence',
  description: 'Index of coincidence measures how likely it is to draw two matching letters by choosing two random letters from a text.',
  url: 'https://ciphereditor.com/explore/index-of-coincidence',
  keywords: ['ic', 'ioc', 'frequency', 'analysis'],
  controls: [
    {
      name: 'text',
      value: 'the quick brown fox jumps over the lazy dog',
      types: ['text']
    },
    {
      name: 'index',
      label: 'IC',
      value: 0.021848739495798318,
      types: ['number', 'integer'],
      writable: false,
      order: 1000
    },
    {
      name: 'indexNormalized',
      label: 'Normalized IC',
      value: 0.5680672268907563,
      types: ['number', 'integer'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const text = request.values.text as string
  const chars = stringToUnicodeCodePoints(text)
    // Remove whitespace characters
    .filter(char => !whitespaceCodePoints.includes(char))

  const n = chars.length
  if (n <= 1) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['text'],
        message: 'Must contain at least two characters'
      }]
    }
  }

  // Count appearances for each unique char
  const valueAppearances = new Map<number, number>()
  for (const char of chars) {
    valueAppearances.set(char, (valueAppearances.get(char) ?? 0) + 1)
  }

  // Index of coincidence calculation
  // \text{IC} = \frac{\sum_{i=1}^nf_i(f_i-1)}{n(n-1)}
  // with f_i is the appearances of letter i and N is the total number of letters
  let coincidence = 0
  for (const appearances of valueAppearances.values()) {
    coincidence += appearances * (appearances - 1)
  }

  const index = coincidence / (n * (n - 1))
  const normalizedIndex = index * valueAppearances.size

  return {
    changes: [
      { name: 'index', value: index },
      { name: 'indexNormalized', value: normalizedIndex }
    ]
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
