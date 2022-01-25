
import { combineReducers } from 'redux'
import blueprintReducer from './blueprint'
import directoryReducer from './directory'
import settingsReducer from './settings'
import uiReducer from './ui'

export const rootReducer = combineReducers({
  blueprint: blueprintReducer,
  directory: directoryReducer,
  settings: settingsReducer,
  ui: uiReducer,
})

export type RootState = ReturnType<typeof rootReducer>
