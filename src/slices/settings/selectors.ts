
import { ReducedMotionPreferenceOption, ScalingOption, SettingsState, ThemeOption } from './types'

export const getTheme = (state: SettingsState): ThemeOption =>
  state.theme

export const getScaling = (state: SettingsState): ScalingOption =>
  state.scaling

export const getReducedMotionPreference = (state: SettingsState): ReducedMotionPreferenceOption =>
  state.reducedMotionPreference

export const getShortcutBindings = (state: SettingsState): {
  [name: string]: string
} => state.shortcutBindings
