import { combineSlices } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { playerSlice, queueSlice } from 'modules/player/store/store'
import { graphqlAPISlice, restAPISlice } from 'api/api'
import { librarySlice } from 'modules/library/store'
import { browserSlice } from 'modules/browser/store'
import { playlistSlice } from 'modules/collections/store'
import { settingsSlice } from 'modules/settings/store'
import { dashboardSlice } from 'modules/dashboard/store'

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we don't need to call `combineReducers`.
const combinedReducer = combineSlices(
  browserSlice,
  dashboardSlice,
  librarySlice,
  playerSlice,
  playlistSlice,
  queueSlice,
  settingsSlice,
  restAPISlice,
  graphqlAPISlice
)

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['library', 'settings'],
}

const rootReducer = persistReducer(persistConfig, combinedReducer)

export default rootReducer
