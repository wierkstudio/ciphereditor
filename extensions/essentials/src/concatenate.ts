
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/concatenate',
  label: 'Concatenate',
  description: 'Concatenate text or byte inputs',
  keywords: ['append', 'join'],
  controls: [
    {
      name: 'a',
      label: 'A',
      value: 'foo',
      types: ['text', 'bytes']
    },
    {
      name: 'b',
      label: 'B',
      value: 'bar',
      types: ['text', 'bytes']
    },
    {
      name: 'ab',
      label: 'AB',
      value: 'foobar',
      types: ['text', 'bytes'],
      writable: false,
      order: 1000
    }
  ]
}

const execute: OperationExecuteExport = (request) => {
  const a = request.values.a as string | ArrayBuffer
  const b = request.values.b as string | ArrayBuffer

  if (typeof a === 'string' && typeof b === 'string') {
    return { changes: [{ name: 'ab', value: a + b }] }
  }

  if (a instanceof ArrayBuffer && b instanceof ArrayBuffer) {
    const bytes = new Uint8Array([...new Uint8Array(a), ...new Uint8Array(b)])
    return { changes: [{ name: 'ab', value: bytes.buffer }] }
  }

  return {
    issues: [{
      level: 'error',
      message: 'Both inputs must either be of type text or of type bytes'
    }]
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
