
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  enterProgramAction,
  leaveProgramAction,
  redoAction,
  removeNodeAction,
  undoAction
} from '../blueprint'
import { popModalAction, endWireAction, toggleAddModalAction } from '../ui'
import { ReducedMotionPreferenceOption, SettingsState, ThemeOption } from './types'

const defaultSettingsState: SettingsState = {
  theme: ThemeOption.SystemDefault,
  reducedMotionPreference: ReducedMotionPreferenceOption.SystemDefault,
  shortcutBindings: {
    // Order: alt+control+shift+meta+key
    // Make sure shortcuts don't trigger for both input-text and app views
    // TODO: Allow for dispatching an action based on platform
    /* eslint-disable quote-props */
    'delete': removeNodeAction.type,
    'backspace': removeNodeAction.type,
    'meta+enter': enterProgramAction.type,
    'meta+arrowup': leaveProgramAction.type,
    'meta+z': undoAction.type,
    'control+z': undoAction.type,
    'shift+meta+z': redoAction.type,
    'control+shift+z': redoAction.type,
    // Windows and Linux systems that use Cinnamon as a DE use Ctrl+y for redo.
    // See https://support.apple.com/en-ie/guide/pages/tana7e101d4c/mac,
    // https://support.microsoft.com/en-us/office/undo-redo-or-repeat-an-action-84bdb9bc-4e23-4f06-ba78-f7b893eb2d28,
    // and https://cheatography.com/shakiestnerd/cheat-sheets/linux-mint-cinnamon/
    'control+y': redoAction.type,
    'escape': [popModalAction.type, endWireAction.type],
    'meta+k': toggleAddModalAction.type,
    'control+k': toggleAddModalAction.type
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
