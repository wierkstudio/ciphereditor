
import { configureStore, ThunkAction, Action, isPlain } from '@reduxjs/toolkit'
import { extensionMiddleware } from './middlewares/extension'
import { rootReducer, RootState } from './slices'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      isSerializable: (value: any): boolean => {
        // Consider ArrayBuffer instances to be immutable, although they are not
        // Assumption: We won't make changes to existing ArrayBuffer objects
        if (value instanceof ArrayBuffer) {
          return true
        }
        return isPlain(value)
      }
    }
  }).concat(
    extensionMiddleware
  )
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = never> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
