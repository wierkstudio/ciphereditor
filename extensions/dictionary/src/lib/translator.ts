
import moo from 'moo'
import {
  defaultConfig,
  Dictionary,
  DictionaryConfig,
  DictionaryElement
} from './dictionary'
import {
  Contribution,
  Control,
  ExtensionContext,
  OperationContributionExports,
  OperationRequest,
  OperationResult
} from '@ciphereditor/library'
import type { DeepRequired } from 'ts-essentials'

/**
 * Arguments used to create a dictionary contribution
 */
export interface CreateDictionaryArgs {
  dictionary: Dictionary
  name: string
  label?: string
  description?: string
  url?: string
  keywords?: string[]
}

/**
 * Translator function
 */
type DictionaryTranslator = (content: string) => string

/**
 * Cached translator instance
 */
let cachedTranslator: DictionaryTranslator | undefined

/**
 * Cached translator key, used to reuse previous instances
 */
let cachedTranslatorKey: string | undefined

/**
 * Create an operation contribution based on the given dictionary and args.
 * @param context Extension context
 * @param args Creation args
 */
export const createDictionaryContribution = (
  context: ExtensionContext,
  args: CreateDictionaryArgs
): OperationContributionExports => {
  const dictionary = args.dictionary
  const controls: Control[] = []

  controls.push({
    name: 'source',
    value: '',
    types: ['text']
  })

  // Compose variants control
  const variants = dictionary.variants
  const hasVariantChoice = variants.length > 1
  if (hasVariantChoice) {
    const defaultVariant = variants.find(variant => variant.default === true)
    controls.push({
      name: 'variant',
      value: defaultVariant?.name ?? variants[0].name,
      types: ['text'],
      options: variants.map(variant => ({
        value: variant.name,
        label: variant.label ?? variant.name
      }))
    })
  }

  controls.push({
    name: 'translation',
    value: '',
    types: ['text'],
    order: 1000,
    writable: dictionary.config?.reversible ?? true
  })

  const contribution: Contribution = {
    type: 'operation',
    name: args.name,
    label: args.label,
    description: args.description,
    url: args.url,
    keywords: args.keywords,
    controls
  }

  const execute = (request: OperationRequest): OperationResult => {
    const forward =
      request.controlPriorities.indexOf('source') <
      request.controlPriorities.indexOf('translation')
    const variantName = request.values.variant
    const inputString = forward
      ? request.values.source as string
      : request.values.translation as string
    const outputControl = forward ? 'translation' : 'source'

    // Find variant by name
    let variant = hasVariantChoice
      ? variants.find(variant => variant.name === variantName)
      : variants[0]
    if (variant === undefined) {
      throw new Error(`Logic error: Unexpected variant name '${variantName}'`)
    }

    // Merge default, dictionary and variant config in this order
    const config: DeepRequired<DictionaryConfig> = {
      ...defaultConfig,
      ...dictionary.config,
      ...variant.config,
      key: {
        ...defaultConfig.key,
        ...dictionary.config?.key,
        ...variant.config?.key
      },
      value: {
        ...defaultConfig.value,
        ...dictionary.config?.value,
        ...variant.config?.value
      }
    }

    const cacheKey = args.name + '-' + variant.name + (forward ? '>' : '<')
    const translator = createDictionaryTranslator(
      cacheKey, variant.elements, config, forward)
    const outputString = translator(inputString)
    return { changes: [{ name: outputControl, value: outputString }] }
  }

  return {
    contribution,
    body: {
      execute
    }
  }
}

/**
 * Lazily create a translator based on a lexer for the given dictionary elements
 * and configuration.
 * @param cacheKey The translator instance gets reused when the cache key stays
 * the same
 */
const createDictionaryTranslator = (
  cacheKey: string,
  elements: DictionaryElement[],
  config: DeepRequired<DictionaryConfig>,
  forward: boolean
): ((content: string) => string) => {
  // Use cached version, if possible
  if (cachedTranslator !== undefined && cachedTranslatorKey === cacheKey) {
    return cachedTranslator
  }

  const keyConfig = forward ? config.key : config.value
  const valueConfig = forward ? config.value : config.key

  // Compile dictionary elements to array of matches
  let matchIndices: Array<{ match: string, index: number }> = []
  for (let index = 0; index < elements.length; index++) {
    const keyWord = forward ? elements[index].key : elements[index].value
    for (const key of (typeof keyWord === 'string' ? [keyWord] : keyWord)) {
      const match = keyConfig.caseSensitive ? key : key.toLowerCase()
      matchIndices.push({ match, index })
    }
  }

  // Apply match strategy (order matches by priority)
  if (keyConfig.matchStrategy === 'longest') {
    matchIndices = matchIndices.sort((a, b) => b.match.length - a.match.length)
  }

  const lexer = moo.compile({
    element: matchIndices.map(({ match, index }) =>
      ({ match, value: () => index.toString() })),
    literal: {
      match: /\[[^\[\]]+\]/,
      value: match => match.substring(1, match.length - 1)
    },
    separator: {
      match: keyConfig.wordSeparator
    },
    fallback: moo.fallback
  })

  cachedTranslatorKey = cacheKey
  cachedTranslator = (content) => {
    // Parse the input string to tokens
    lexer.reset(keyConfig.caseSensitive ? content : content.toLowerCase())
    const tokens: moo.Token[] = []
    let token
    while ((token = lexer.next()) !== undefined) {
      tokens.push(token)
    }

    const parts = tokens.map(token => {
      switch (token.type) {
        case 'element': {
          const elementIndex = parseInt(token.value)
          const element = elements[elementIndex]
          const valueWord = forward ? element.value : element.key
          const choices = typeof valueWord === 'string' ? [valueWord] : valueWord
          return (
            valueConfig.choiceStrategy === 'first'
              ? choices[0]
              // TODO: Use cryptographically secure random
              : choices[Math.floor(Math.random() * choices.length)]
          )
        }
        case 'literal': {
          // Insert literal text as-is
          return token.value
        }
        case 'separator': {
          // Ignore separators
          return ''
        }
        default: {
          // Wrap foreign text in literal
          // TODO: Make literal format configurable
          return `[${token.value}]`
        }
      }
    })

    return parts.filter(part => part.length > 0).join(valueConfig.wordSeparator)
  }

  return cachedTranslator
}
