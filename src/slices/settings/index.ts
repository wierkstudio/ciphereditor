
import { createSlice } from '@reduxjs/toolkit'
import {
  enterProgramAction,
  leaveProgramAction,
  removeNodeAction,
} from 'slices/blueprint'
import { SettingsState } from 'types/settings'

const defaultSettingsState: SettingsState = {
  shortcutBindings: {
    'delete+meta': removeNodeAction.type,
    'backspace+meta': removeNodeAction.type,
    'enter+meta': enterProgramAction.type,
    'arrowup+meta': leaveProgramAction.type,
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
