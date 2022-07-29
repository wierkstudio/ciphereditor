
import { LabeledImplicitTypedValue } from '@ciphereditor/types'

export const alphabetTextChoices: LabeledImplicitTypedValue[] = [
  {
    value: 'abcdefghijklmnopqrstuvwxyz',
    label: 'Latin alphabet (a-z)'
  },
  {
    value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    label: 'Uppercase Latin alphabet (A-Z)'
  },
  {
    value: 'αβγδεζηθικλμνξοπρστυφχψω',
    label: 'Greek alphabet (α-ω)'
  },
  {
    value: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
    label: 'Uppercase Greek alphabet (Α-Ω)'
  }
]

export const separatorTextChoices: LabeledImplicitTypedValue[] = [
  { value: ' ', label: 'Space' },
  { value: ',', label: 'Comma (,)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: '-', label: 'Minus (-)' },
  { value: '_', label: 'Underscore (_)' },
  { value: '\n', label: 'Newline (LF)' },
  { value: '\r\n', label: 'Newline (CR LF)' }
]
