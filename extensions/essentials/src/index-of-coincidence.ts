
import { Contribution, OperationExecuteExport, OperationIssue } from '@ciphereditor/library'
import { alphabetTextChoices } from './shared/options'
import { hasUniqueElements } from './lib/array'
import { stringToUnicodeCodePoints } from './lib/unicode'

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
      name: 'alphabet',
      value: 'abcdefghijklmnopqrstuvwxyz',
      types: ['text'],
      options: alphabetTextChoices,
      enforceOptions: false
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
  const alphabet = request.values.alphabet as string

  const textChars = stringToUnicodeCodePoints(text)
  const alphabetChars = stringToUnicodeCodePoints(alphabet)

  // Validate alphabet
  const issues: OperationIssue[] = []

  if (alphabetChars.length <= 1) {
    issues.push({
      level: 'error',
      targetControlNames: ['alphabet'],
      message: 'The alphabet must have a size of 2 characters or more'
    })
  }

  if (!hasUniqueElements(alphabetChars)) {
    issues.push({
      level: 'error',
      targetControlNames: ['alphabet'],
      message: 'The alphabet must not contain duplicate characters'
    })
  }

  // Bail out, if the input is not valid
  if (issues.length > 0) {
    return { issues }
  }

  // Prepare alphabets
  const lowerCaseAlphabetChars = stringToUnicodeCodePoints(alphabet.toLowerCase())
  const upperCaseAlphabetChars = stringToUnicodeCodePoints(alphabet.toUpperCase())
  const c = alphabetChars.length

  // Measure char frequency for the given text
  const charFrequency = new Array(c).fill(0)
  let n = 0
  let charIndex
  for (const char of textChars) {
    // Try to match character in a case-insensitive way
    charIndex = alphabetChars.indexOf(char)
    if (charIndex === -1) {
      charIndex = lowerCaseAlphabetChars.indexOf(char)
    }
    if (charIndex === -1) {
      charIndex = upperCaseAlphabetChars.indexOf(char)
    }

    if (charIndex !== -1) {
      charFrequency[charIndex]++
      n++
    }
  }

  // Index of coincidence calculation
  // \text{IC} = \frac{\sum_{i=1}^nf_i(f_i-1)}{n(n-1)}
  // with f_i is the frequency of letter i and n is the total number of letters
  let coincidence = 0
  for (let i = 0; i < c; i++) {
    coincidence += charFrequency[i] * (charFrequency[i] - 1)
  }
  const index = n > 1 ? (coincidence / (n * (n - 1))) : 0
  const normalizedIndex = index * c

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
