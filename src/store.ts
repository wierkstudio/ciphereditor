
import { rootReducer, RootState } from './slices'
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { processorMiddleware } from 'middlewares/processor'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    processorMiddleware
  )
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = never> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
