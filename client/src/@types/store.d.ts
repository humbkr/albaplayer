// eslint-disable-next-line import/no-extraneous-dependencies
import { ThunkAction } from 'redux-thunk'
import { Action } from '@reduxjs/toolkit'
import { PersistedState } from 'redux-persist'

export declare global {
  type RootState = PersistedState &
    StateType<ReturnType<typeof import('./rootReducer').default>>
  type AppDispatch = typeof import('./store').default.dispatch
  type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
}
