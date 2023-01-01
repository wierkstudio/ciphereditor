
import { Contribution, OperationExecuteExport } from '@ciphereditor/library'

const contribution: Contribution = {
  type: 'operation',
  name: '@ciphereditor/extension-essentials/trigonometric-function',
  label: 'Trigonometric function',
  description: 'Provide functions sine, cosine, tangent as well as their hyperbolic counterparts and inverses',
  url: 'https://ciphereditor.com/explore/trigonometric-functions-sin-cos-tan',
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
        { value: 'arcminute', label: 'Minute of arc (′)' },
        { value: 'arcsecond', label: 'Second of arc (″)' },
        { value: 'grad', label: 'Grad' },
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
        { value: 'csc', label: 'Cosecant (csc)' },
        { value: 'sec', label: 'Secant (sec)' },
        { value: 'cot', label: 'Cotangent (cot)' }
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

type TrigonometricFunction =
  'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot'

/**
 * Object mapping trigonometric function names to their respective functions.
 * Functions take an angle as radians and return a result which may be NaN
 * or infinite.
 */
const trigonometricFunctionMap: Record<TrigonometricFunction, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  csc: x => 1 / Math.sin(x),
  sec: x => 1 / Math.cos(x),
  cot: x => 1 / Math.tan(x)
}

/**
 * Object mapping trigonometric function names to their respective
 * inverse functions. Functions take an angle as radians and return a result
 * which may be NaN or infinite.
 */
const inverseTrigonometricFunctionMap: Record<TrigonometricFunction, (x: number) => number> = {
  sin: Math.asin,
  cos: Math.acos,
  tan: Math.atan,
  csc: x => Math.asin(1 / x),
  sec: x => Math.acos(1 / x),
  cot: x => Math.atan(1 / x)
}

type AngleUnit =
  'radian' | 'degree' | 'arcminute' | 'arcsecond' | 'grad' | 'turn'

/**
 * Object mapping angle units to their respective conversion functions that
 * convert to radians.
 */
const angleRadianConversionMap: Record<AngleUnit, (x: number) => number> = {
  radian: x => x,
  degree: x => x * (Math.PI / 180),
  arcminute: x => x * (Math.PI / (180 * 60)),
  arcsecond: x => x * (Math.PI / (180 * 3600)),
  grad: x => x * (800 * Math.PI),
  turn: x => x * (2 * Math.PI)
}

/**
 * Object mapping angle units to their respective inverse conversion functions
 * that convert from radians.
 */
const radianAngleConversionMap: Record<AngleUnit, (x: number) => number> = {
  radian: x => x,
  degree: x => x * (180 / Math.PI),
  arcminute: x => x * ((180 * 60) / Math.PI),
  arcsecond: x => x * ((180 * 3600) / Math.PI),
  grad: x => x / (800 * Math.PI),
  turn: x => x / (2 * Math.PI)
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
    const radians = angleRadianConversionMap[angleUnit](angle)

    // Evaluate trigonometric function
    const functionValue = trigonometricFunctionMap[functionName](radians)

    // Check for NaN and infinite values that occur outside of the domain
    if (isNaN(functionValue) || !Number.isFinite(functionValue)) {
      return {
        issues: [{
          level: 'error',
          message: 'Angle is not in the domain of the function',
          targetControlNames: ['angle']
        }]
      }
    }

    return { changes: [{ name: 'functionValue', value: functionValue }] }
  } else {
    // Evaluate inverse trigonometric function
    const functionValue = request.values.functionValue as number
    const radians = inverseTrigonometricFunctionMap[functionName](functionValue)

    // Check for NaN and infinite values that occur outside of the domain
    if (isNaN(radians) || !Number.isFinite(radians)) {
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
    const angle = radianAngleConversionMap[angleUnit](radians)
    return { changes: [{ name: 'angle', value: angle }] }
  }
}

export default {
  contribution,
  body: {
    execute
  }
}
