
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  enterProgramAction,
  leaveProgramAction,
  redoAction,
  removeNodeAction,
  undoAction
} from 'slices/blueprint'
import { cancelTopModalAction } from 'slices/ui'
import { ReducedMotionPreferenceOption, ScalingOption, SettingsState, ThemeOption } from './types'

const defaultSettingsState: SettingsState = {
  theme: ThemeOption.SystemDefault,
  scaling: ScalingOption.SystemDefault,
  reducedMotionPreference: ReducedMotionPreferenceOption.SystemDefault,
  shortcutBindings: {
    // Order: alt+control+shift+meta+key
    // Make sure shortcuts don't trigger for both input-text and app views
    /* eslint-disable quote-props */
    'delete': removeNodeAction.type,
    'backspace': removeNodeAction.type,
    'meta+enter': enterProgramAction.type,
    'meta+arrowup': leaveProgramAction.type,
    'meta+z': undoAction.type,
    'control+z': undoAction.type,
    'shift+meta+z': redoAction.type,
    'control+shift+z': redoAction.type,
    'escape': cancelTopModalAction.type
    /* eslint-enable quote-props */
  }
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

    applyScaling: (state, { payload }: PayloadAction<{
      scaling: ScalingOption
    }>) => {
      state.scaling = payload.scaling
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
  applyScaling,
  applyReducedMotionPreference
} = settingsSlice.actions

export default settingsSlice.reducer
