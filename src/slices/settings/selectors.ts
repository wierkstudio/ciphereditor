
import { SettingsState } from './types'

export const getShortcutBindings = (state: SettingsState): {
  [name: string]: string
} => state.shortcutBindings
