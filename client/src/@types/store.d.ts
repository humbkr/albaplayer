import { Action, ThunkAction } from '@reduxjs/toolkit'
import store from 'store/store'
import rootReducer from 'store/rootReducer'

export declare global {
  type AppDispatch = typeof store.dispatch
  type RootState = ReturnType<typeof store.getState>
  type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
  >
  type RootReducer = ReturnType<typeof rootReducer>
}
