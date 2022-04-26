
/**
 * Settings state
 */
export interface SettingsState {
  /**
   * Theme preference
   */
  theme: ThemeOption

  /**
   * Scaling factor, if any
   */
  scaling: ScalingOption

  /**
   * Indicate wether the user has notified the app that they prefer an interface
   * that removes or replaces the types of motion-based animation that trigger
   * discomfort for those with vestibular motion disorders.
   */
  reducedMotionPreference: ReducedMotionPreferenceOption

  /**
   * Object mapping key combination strings to action types
   */
  shortcutBindings: { [name: string]: string | string[] }
}

/**
 * Theme preference options
 */
export enum ThemeOption {
  SystemDefault = 'system',
  Light = 'light',
  Dark = 'dark'
}

/**
 * Scaling options
 */
export enum ScalingOption {
  SystemDefault = 'system',
  Normal = 'normal',
  Large = 'large',
  Huge = 'huge'
}

/**
 * Reduced motion options
 */
export enum ReducedMotionPreferenceOption {
  SystemDefault = 'system',
  Reduce = 'reduce'
}
