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

// Only persist the library data: transient flags like `isFetching` must
// always start from their initial values, otherwise a page reload during a
// fetch would leave the app stuck on the loading screen.
const libraryPersistConfig = {
  key: 'library',
  storage,
  whitelist: ['lastScan', 'artists', 'albums', 'tracks'],
}

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we don't need to call `combineReducers`.
const combinedReducer = combineSlices(
  browserSlice,
  dashboardSlice,
  {
    [librarySlice.reducerPath]: persistReducer(
      libraryPersistConfig,
      librarySlice.reducer
    ),
  },
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
  whitelist: ['settings'],
}

const rootReducer = persistReducer(persistConfig, combinedReducer)

export default rootReducer
