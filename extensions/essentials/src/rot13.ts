
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'
import { simpleSubstitutionEncode } from './simple-substitution'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/rot13',
  label: 'ROT13',
  description: 'Method in which each letter in a text is rotated by 13 places.',
  url: 'https://ciphereditor.com/explore/rot13',
  keywords: ['substitution', 'cipher', 'shift', 'rot5', 'rot18', 'rot47'],
  controls: [
    {
      name: 'plaintext',
      value: 'the quick brown fox jumps over the lazy dog',
      types: ['text']
    },
    {
      name: 'variant',
      value: 'rot13',
      types: ['text'],
      options: [
        { value: 'rot5', label: 'ROT5 (0-9)' },
        { value: 'rot13', label: 'ROT13 (A-Z)' },
        { value: 'rot18', label: 'ROT18 (0-9, A-Z)' },
        { value: 'rot47', label: 'ROT47 (!-~)' }
      ]
    },
    {
      name: 'ciphertext',
      value: 'gur dhvpx oebja sbk whzcf bire gur ynml qbt',
      types: ['text'],
      order: 1000
    }
  ]
}

const rot47A = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNO'
const rot47B = 'PQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request

  const variant = values.variant as 'rot5' | 'rot13' | 'rot18' | 'rot47'
  const encode =
    controlPriorities.indexOf('plaintext') <
    controlPriorities.indexOf('ciphertext')

  const inputString = (encode ? values.plaintext : values.ciphertext) as string

  let outputString
  switch (variant) {
    case 'rot5': {
      outputString = simpleSubstitutionEncode(
        inputString,
        '0123456789',
        '5678901234'
      )
      break
    }
    case 'rot13': {
      outputString = simpleSubstitutionEncode(
        inputString,
        'abcdefghijklmnopqrstuvwxyz',
        'nopqrstuvwxyzabcdefghijklm'
      )
      break
    }
    case 'rot18': {
      outputString = simpleSubstitutionEncode(
        inputString,
        'abcdefghijklmnopqrstuvwxyz0123456789',
        'nopqrstuvwxyzabcdefghijklm5678901234'
      )
      break
    }
    case 'rot47': {
      outputString = simpleSubstitutionEncode(
        inputString,
        rot47A + rot47B,
        rot47B + rot47A
      )
      break
    }
  }

  const outputControl = encode ? 'ciphertext' : 'plaintext'
  return { changes: [{ name: outputControl, value: outputString }] }
}

export default {
  contribution,
  body: {
    execute
  }
}
