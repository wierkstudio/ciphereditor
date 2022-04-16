
import { configureStore, ThunkAction, Action, isPlain } from '@reduxjs/toolkit'
import { processorMiddleware } from 'middlewares/processor'
import { rootReducer, RootState } from './slices'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      isSerializable: (value: any): boolean => {
        // Consider Uint8Array instances to be immutable, although they are not
        // Assumption: We won't make changes to existing Uint8Array objects
        if (value instanceof Uint8Array) {
          return true
        }
        return isPlain(value)
      }
    }
  }).concat(
    processorMiddleware
  )
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = never> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
