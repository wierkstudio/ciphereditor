
import { createSlice } from '@reduxjs/toolkit'
import {
  enterProgramAction,
  leaveProgramAction,
  redoAction,
  removeNodeAction,
  undoAction,
} from 'slices/blueprint'
import { SettingsState } from 'types/settings'

const defaultSettingsState: SettingsState = {
  shortcutBindings: {
    // Order: key+meta+control+shift+alt
    'delete+meta': removeNodeAction.type,
    'backspace+meta': removeNodeAction.type,
    'enter+meta': enterProgramAction.type,
    'arrowup+meta': leaveProgramAction.type,
    'z+meta': undoAction.type,
    'z+meta+shift': redoAction.type,
  }
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaultSettingsState,
  reducers: {}
})

export const {
} = settingsSlice.actions

export default settingsSlice.reducer
