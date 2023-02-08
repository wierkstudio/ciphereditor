
import { ReducedMotionPreferenceOption, SettingsState, ThemeOption } from './types'
import { checkPlatform } from '../../lib/utils/platform'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { defaultMacOSKeyBindings, defaultKeyBindings } from './key-bindings'

const defaultSettingsState: SettingsState = {
  theme: 'system',
  reducedMotionPreference: 'system',
  keyBindings:
    checkPlatform('macos')
      ? defaultMacOSKeyBindings
      : defaultKeyBindings
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaultSettingsState,
  reducers: {
    applyTheme: (state, { payload }: PayloadAction<{
      theme: ThemeOption
    }>) => {
      state.theme = payload.theme
    },

    applyReducedMotionPreference: (state, { payload }: PayloadAction<{
      reducedMotionPreference: ReducedMotionPreferenceOption
    }>) => {
      state.reducedMotionPreference = payload.reducedMotionPreference
    }
  }
})

export const {
  applyTheme,
  applyReducedMotionPreference
} = settingsSlice.actions

export default settingsSlice.reducer
