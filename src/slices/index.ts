
import { combineReducers } from 'redux'
import blueprintReducer from './blueprint'
import directoryReducer from './directory'
import settingsReducer from './settings'

export const rootReducer = combineReducers({
  blueprint: blueprintReducer,
  directory: directoryReducer,
  settings: settingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>
