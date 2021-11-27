
import { combineReducers } from 'redux'
import blueprintReducer from './blueprint'

export const rootReducer = combineReducers({
  blueprint: blueprintReducer,
})
export type RootState = ReturnType<typeof rootReducer>
