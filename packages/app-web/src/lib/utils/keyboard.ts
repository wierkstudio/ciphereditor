
import { identifyPlatform, Platform } from './platform'

/**
 * Modifier keys in order in which they appear in the key combination notation
 */
const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta']

/**
 * Map with platform specific symbols for keys
 */
const keyPlatformSymbolMap: Record<string, Record<Platform, string> | string> = {
  alt: { windows: 'Alt', macos: '⌥', unknown: 'Alt' },
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  arrowup: '↑',
  control: { windows: 'Ctrl', macos: '⌃', unknown: 'Ctrl' },
  escape: 'ESC',
  meta: { windows: 'Win', macos: '⌘', unknown: 'Meta' },
  shift: { windows: 'Shift', macos: '⇧', unknown: 'Shift' }
}

/**
 * Map with platform specific dividers
 */
const platformKeyDivider: Record<Platform, string> = {
  macos: '',
  unknown: '+',
  windows: '+'
}

/**
 * Compose key combination notation from the given keyboard event.
 */
export const keyCombinationFromEvent = (event: KeyboardEvent): string => {
  const pressedKeys = modifierKeys.filter(key => event.getModifierState(key))
  if (!pressedKeys.includes(event.key)) {
    pressedKeys.push(event.key)
  }
  return pressedKeys.join('+').toLowerCase()
}

/**
 * Compose a human-readable string describing the given key combination
 */
export const labelKeyCombination = (keyCombination: string): string => {
  const platform = identifyPlatform()
  return keyCombination.split(platformKeyDivider[platform]).map(key => {
    const symbolOrPlatformSymbolMap = keyPlatformSymbolMap[key]
    if (typeof symbolOrPlatformSymbolMap === 'string') {
      return symbolOrPlatformSymbolMap
    }
    const symbol = symbolOrPlatformSymbolMap?.[platform]
    if (symbol !== undefined) {
      return symbol
    }
    const [firstLetter, ...remainingKey] = key
    return [firstLetter.toLocaleUpperCase(), ...remainingKey].join('')
  }).join('+')
}
