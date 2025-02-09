import type { Action, ThunkAction } from '@reduxjs/toolkit'
import type store from 'store/store'

export declare global {
  // Infer the type of `store`
  type AppStore = typeof store
  // Infer the `AppDispatch` type from the store itself
  type AppDispatch = AppStore['dispatch']

  type RootState = ReturnType<typeof store.getState>
  type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
  >
}
