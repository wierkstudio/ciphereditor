
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/trigonometric-function',
  label: 'Trigonometric function',
  description: 'Provide functions sine, cosine, tangent as well as their hyperbolic counterparts and inverses',
  url: 'https://ciphereditor.com/explore/trigonometric-functions',
  keywords: ['sine', 'cosine', 'tangent', 'hyperbolic', 'radians', 'degrees', 'turns'],
  controls: [
    {
      name: 'angle',
      value: 0,
      types: ['integer', 'number']
    },
    {
      name: 'angleUnit',
      value: 'radian',
      types: ['text'],
      options: [
        { value: 'radian', label: 'Radians (rad)' },
        { value: 'degree', label: 'Degrees (°)' },
        { value: 'turn', label: 'Turns (rev)' }
      ]
    },
    {
      name: 'function',
      value: 'sin',
      types: ['text'],
      options: [
        { value: 'sin', label: 'Sine (sin)' },
        { value: 'cos', label: 'Cosine (cos)' },
        { value: 'tan', label: 'Tangent (tan)' },
        { value: 'sinh', label: 'Hyperbolic sine (sinh)' },
        { value: 'cosh', label: 'Hyperbolic cosine (cosh)' },
        { value: 'tanh', label: 'Hyperbolic tangent (tanh)' }
      ]
    },
    {
      name: 'functionValue',
      value: 0,
      types: ['integer', 'number'],
      order: 1000
    }
  ]
}

type TrigonometricFunction = 'sin' | 'cos' | 'tan' | 'sinh' | 'cosh' | 'tanh'
type AngleUnit = 'radian' | 'degree' | 'turn'

const trigonometricFunctionMap: Record<TrigonometricFunction, (radians: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh
}

const inverseTrigonometricFunctionMap: Record<TrigonometricFunction, (functionValue: number) => number> = {
  sin: Math.asin,
  cos: Math.acos,
  tan: Math.atan,
  sinh: Math.asinh,
  cosh: Math.acosh,
  tanh: Math.atanh
}

const execute: OperationExecuteExport = (request) => {
  const { values, controlPriorities } = request
  const angleUnit = values.angleUnit as AngleUnit
  const functionName = values.function as TrigonometricFunction
  const inverse =
    controlPriorities.indexOf('functionValue') <
    controlPriorities.indexOf('angle')

  if (!inverse) {
    // Convert the angle from the angle unit to radians
    const angle = request.values.angle as number
    let radians: number
    switch (angleUnit) {
      case 'radian': {
        radians = angle
        break
      }
      case 'degree': {
        radians = angle * (Math.PI / 180)
        break
      }
      case 'turn': {
        radians = angle * (2 * Math.PI)
        break
      }
    }

    // Evaluate trigonometric function
    const functionValue = trigonometricFunctionMap[functionName](radians)

    // The domain of a trigonometric function is the whole real line, so we
    // don't need to check for NaN values here
    return { changes: [{ name: 'functionValue', value: functionValue }] }
  } else {
    // Evaluate inverse trigonometric function
    const functionValue = request.values.functionValue as number
    const radians = inverseTrigonometricFunctionMap[functionName](functionValue)

    // Check for NaN values that are returned for function values outside
    // of the inverse domain
    if (isNaN(radians)) {
      return {
        issues: [{
          level: 'error',
          message:
            'Function value is not in the domain of the inverse function',
          targetControlNames: ['functionValue']
        }]
      }
    }

    // Convert radians to the desired angle unit
    let angle: number
    switch (angleUnit) {
      case 'radian': {
        angle = radians
        break
      }
      case 'degree': {
        angle = radians * (180 / Math.PI)
        break
      }
      case 'turn': {
        angle = radians / (2 * Math.PI)
        break
      }
    }

    return { changes: [{ name: 'angle', value: angle }] }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
