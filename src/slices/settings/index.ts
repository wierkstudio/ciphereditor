
import { createSlice } from '@reduxjs/toolkit'
import {
  enterProgramAction,
  leaveProgramAction,
  redoAction,
  removeNodeAction,
  undoAction
} from 'slices/blueprint'
import { cancelTopModalAction } from 'slices/ui'
import { SettingsState } from './types'

const defaultSettingsState: SettingsState = {
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
  reducers: {}
})

// export const {} = settingsSlice.actions

export default settingsSlice.reducer
