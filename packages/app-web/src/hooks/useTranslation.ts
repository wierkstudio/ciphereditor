
interface TranslateOptions {
  [key: string]: any
}

const t = (
  namespace: string,
  keyOrKeys: string | string[],
  options?: TranslateOptions
): string => {
  const keys = typeof keyOrKeys === 'string' ? [keyOrKeys] : keyOrKeys
  return keys[0]
}

type TranslateFunctionSignature = (
  keys: string | string[],
  options?: TranslateOptions
) => string

/**
 * Hook making i18n and translations available in views.
 * As of now this is just a placeholder to mark existing translations in the
 * project, preparing for the final i18n solution.
 */
const useTranslation = (namespace: string = 'ciphereditor'): [TranslateFunctionSignature] => {
  return [t.bind(null, namespace)]
}

export default useTranslation
