
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { hasUniqueElements } from './lib/array'
import { stringFromUnicodeCodePoints, stringToUnicodeCodePoints } from './lib/unicode'

const latinAlphabetWithoutJ = 'abcdefghiklmnopqrstuvwxyz'
const uppercaseLatinAlphabetWithoutJ = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'
const latinAlphabetWithoutK = 'abcdefghijlmnopqrstuvwxyz'
const uppercaseLatinAlphabetWithoutK = 'ABCDEFGHIJLMNOPQRSTUVWXYZ'

/**
 * For the latin alphabet to fit into a 5x5 square, two letters must be
 * combined (usually I and J or C and K). For this, we replace one letter by
 * the other before we encode the plaintext, depending on the chosen alphabet.
 */
const alphabetPlaintextFilterMap: Record<string, (s: string) => string> = {
  [latinAlphabetWithoutJ]: plaintext => plaintext.replace('j', 'i'),
  [uppercaseLatinAlphabetWithoutJ]: plaintext => plaintext.replace('J', 'I'),
  [latinAlphabetWithoutK]: plaintext => plaintext.replace('k', 'c'),
  [uppercaseLatinAlphabetWithoutK]: plaintext => plaintext.replace('K', 'C')
}

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/polybius-square',
  label: 'Polybius square',
  description: 'Method in which the alphabet gets layed out in a grid that is then being used to represent each letter in the plaintext by its coordinates in the grid.',
  url: 'https://ciphereditor.com/explore/polybius-square-cipher',
  keywords: ['polybius checkerboard'],
  controls: [
    {
      name: 'plaintext',
      value: 'thequickbrownfoxjumpsoverthelazydog',
      types: ['text']
    },
    {
      name: 'alphabet',
      value: latinAlphabetWithoutJ,
      types: ['text'],
      options: [
        {
          value: latinAlphabetWithoutJ,
          label: 'Latin (a-z) without j'
        },
        {
          value: uppercaseLatinAlphabetWithoutJ,
          label: 'Uppercase Latin (A-Z) without J'
        },
        {
          value: latinAlphabetWithoutK,
          label: 'Latin (a-z) without k'
        },
        {
          value: uppercaseLatinAlphabetWithoutK,
          label: 'Uppercase Latin (A-Z) without K'
        },
        {
          value: 'αβγδεζηθικλμνξοπρστυφχψω',
          label: 'Greek (α-ω)'
        },
        {
          value: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
          label: 'Uppercase Greek (Α-Ω)'
        }
      ],
      enforceOptions: false
    },
    {
      name: 'columnSymbols',
      value: '12345',
      types: ['text']
    },
    {
      name: 'rowSymbols',
      value: '12345',
      types: ['text']
    },
    {
      name: 'separateCoordinates',
      value: false,
      types: ['boolean']
    },
    {
      name: 'ciphertext',
      value: '4423154145241325124234523321345324453235433451154244231531115554143422',
      types: ['text'],
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request
  const encode =
    controlPriorities.indexOf('plaintext') <
    controlPriorities.indexOf('ciphertext')
  const alphabetString = values.alphabet as string
  const colSymbolsString = values.columnSymbols as string
  const rowSymbolsString = values.rowSymbols as string

  // Validate alphabet
  const alphabet = stringToUnicodeCodePoints(alphabetString)
  if (alphabet.length <= 1) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['alphabet'],
        message: 'Must have a size of 2 characters or more'
      }]
    }
  }
  if (!hasUniqueElements(alphabet)) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['alphabet'],
        message: 'Must not contain duplicate characters'
      }]
    }
  }

  // Validate column symbols
  const colSymbols = stringToUnicodeCodePoints(colSymbolsString)
  if (colSymbols.length <= 1) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['colSymbols'],
        message: 'Must have a size of 2 symbols or more'
      }]
    }
  }
  if (!hasUniqueElements(colSymbols)) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['colSymbols'],
        message: 'Must not contain duplicate characters'
      }]
    }
  }

  // Validate row symbols
  const rowSymbols = stringToUnicodeCodePoints(rowSymbolsString)
  if (rowSymbols.length <= 1) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['rowSymbols'],
        message: 'Must have a size of 2 symbols or more'
      }]
    }
  }
  if (!hasUniqueElements(rowSymbols)) {
    return {
      issues: [{
        level: 'error',
        targetControlNames: ['rowSymbols'],
        message: 'Must not contain duplicate characters'
      }]
    }
  }

  // TODO: Validate alphabet, column and row symbols (no duplicate symbols)
  if (encode) {
    const plaintext = values.plaintext as string
    const separateCoordinates = values.separateCoordinates as boolean
    const ciphertext = polybiusSquareEncode(
      plaintext, alphabetString, colSymbolsString, rowSymbolsString, separateCoordinates)
    return { changes: [{ name: 'ciphertext', value: ciphertext }] }
  } else {
    const ciphertext = values.ciphertext as string
    const plaintext = polybiusSquareDecode(
      ciphertext, alphabetString, colSymbolsString, rowSymbolsString)
    return { changes: [{ name: 'plaintext', value: plaintext }] }
  }
}

export const polybiusSquareEncode = (
  plaintextString: string,
  alphabetString: string = latinAlphabetWithoutJ,
  colSymbolsString: string = '12345',
  rowSymbolsString: string = '12345',
  separateCoordinates: boolean = false
): string => {
  // Handle plaintext replacement for specific alphabets
  const plaintextFilter = alphabetPlaintextFilterMap[alphabetString]
  if (plaintextFilter !== undefined) {
    plaintextString = plaintextFilter(plaintextString)
  }

  // Translate strings to arrays of code points
  const plaintext = stringToUnicodeCodePoints(plaintextString)
  const lowerCasePlaintext = stringToUnicodeCodePoints(plaintextString.toLowerCase())
  const alphabet = stringToUnicodeCodePoints(alphabetString)
  const lowerCaseAlphabet = stringToUnicodeCodePoints(alphabetString.toLowerCase())
  const colSymbols = stringToUnicodeCodePoints(colSymbolsString)
  const rowSymbols = stringToUnicodeCodePoints(rowSymbolsString)

  const gridWidth = colSymbols.length
  const gridHeight = rowSymbols.length

  // We will devide by gridWith so let's make sure we don't devide by 0
  if (gridWidth === 0) {
    return ''
  }

  const plaintextLength = plaintext.length
  const ciphertext: number[] = new Array(plaintextLength * 2)
  let ciphertextIndex = 0

  let col: number
  let row: number
  let symbolIndex: number
  for (let i = 0; i < plaintextLength; i++) {
    // Try to find symbol in case sensitive alphabet
    symbolIndex = alphabet.indexOf(plaintext[i])

    if (symbolIndex === -1) {
      // Try to find symbol in case insensitive alphabet
      symbolIndex = lowerCaseAlphabet.indexOf(lowerCasePlaintext[i])
    }

    if (symbolIndex !== -1) {
      // Calculate coordinates from the symbol index
      col = symbolIndex % gridWidth
      row = Math.floor(symbolIndex / gridWidth)

      if (row < gridHeight) {
        // Append coordinates to the ciphertext
        if (separateCoordinates && ciphertextIndex > 0) {
          ciphertext[ciphertextIndex++] = 32
        }
        ciphertext[ciphertextIndex++] = rowSymbols[row]
        ciphertext[ciphertextIndex++] = colSymbols[col]
      }
    }
  }

  return stringFromUnicodeCodePoints(ciphertext.slice(0, ciphertextIndex))
}

export const polybiusSquareDecode = (
  ciphertextString: string,
  alphabetString: string = latinAlphabetWithoutJ,
  colSymbolsString: string = '12345',
  rowSymbolsString: string = '12345'
): string => {
  // Translate strings to arrays of code points
  const ciphertext = stringToUnicodeCodePoints(ciphertextString)
  const lowerCaseCiphertext = stringToUnicodeCodePoints(ciphertextString.toLowerCase())
  const alphabet = stringToUnicodeCodePoints(alphabetString)
  const colSymbols = stringToUnicodeCodePoints(colSymbolsString)
  const lowerCaseColSymbols = stringToUnicodeCodePoints(colSymbolsString.toLowerCase())
  const rowSymbols = stringToUnicodeCodePoints(rowSymbolsString)
  const lowerCaseRowSymbols = stringToUnicodeCodePoints(rowSymbolsString.toLowerCase())

  const gridWidth = colSymbols.length
  const alphabetLength = alphabet.length
  const ciphertextLength = ciphertext.length
  const plaintext: number[] = new Array(Math.floor(ciphertextLength / 2))
  let plaintextIndex = 0

  let row: number = -1
  let col: number = -1
  let symbolIndex: number
  let codePoint: number
  let lowerCaseCodePoint: number
  for (let i = 0; i < ciphertextLength; i++) {
    codePoint = ciphertext[i]
    lowerCaseCodePoint = lowerCaseCiphertext[i]
    if (row === -1) {
      row = rowSymbols.indexOf(codePoint)
      if (row === -1) {
        row = lowerCaseRowSymbols.indexOf(lowerCaseCodePoint)
      }
    } else {
      col = colSymbols.indexOf(codePoint)
      if (col === -1) {
        col = lowerCaseColSymbols.indexOf(lowerCaseCodePoint)
      }
      if (col !== -1) {
        symbolIndex = row * gridWidth + col
        row = -1
        col = -1
        if (symbolIndex < alphabetLength) {
          plaintext[plaintextIndex++] = alphabet[symbolIndex]
        }
      }
    }
  }

  return stringFromUnicodeCodePoints(plaintext.slice(0, plaintextIndex))
}

export default {
  contribution,
  body: {
    execute
  }
}
