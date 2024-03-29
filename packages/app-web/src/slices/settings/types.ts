
/**
 * Settings state
 */
export interface SettingsState {
  /**
   * Theme preference
   */
  theme: ThemeOption

  /**
   * Indicate wether the user has notified the app that they prefer an interface
   * that removes or replaces the types of motion-based animation that trigger
   * discomfort for those with vestibular motion disorders.
   */
  reducedMotionPreference: ReducedMotionPreferenceOption

  /**
   * Object mapping key combination strings to action types
   */
  keyBindings: { [keyCombination: string]: string | string[] }
}

/**
 * Theme preference options
 */
export type ThemeOption = 'system' | 'light' | 'dark'

/**
 * Reduced motion options
 */
export type ReducedMotionPreferenceOption = 'system' | 'reduce'
