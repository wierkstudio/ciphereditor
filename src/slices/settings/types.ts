
/**
 * Settings state
 */
export interface SettingsState {
  /**
   * Object mapping key combination strings to action types
   */
  shortcutBindings: { [name: string]: string }
}
