
import { ReducedMotionPreferenceOption, SettingsState } from './types'

export const getAccessibilitySettings = (state: SettingsState): {
  theme: SettingsState['theme']
  reducedMotionPreference: ReducedMotionPreferenceOption
} => ({
  theme: state.theme,
  reducedMotionPreference: state.reducedMotionPreference
})

export const getKeyBindings = (state: SettingsState): {
  [name: string]: string | string[]
} => state.keyBindings

export const getKeyCombination = (
  state: SettingsState,
  keyBindingTarget: string
): string | undefined => {
  for (const keyCombination in state.keyBindings) {
    const target = state.keyBindings[keyCombination]
    if (Array.isArray(target) ? target.includes(keyBindingTarget) : target === keyBindingTarget) {
      return keyCombination
    }
  }
  return undefined
}
