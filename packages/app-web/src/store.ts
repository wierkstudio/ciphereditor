
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { directoryMiddleware } from './middlewares/directory'
import { extensionMiddleware } from './middlewares/extension'
import { rootReducer, RootState } from './slices'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    directoryMiddleware,
    extensionMiddleware
  )
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = never> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
