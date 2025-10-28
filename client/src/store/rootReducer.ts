import { combineSlices } from '@reduxjs/toolkit'
import { playerSlice, queueSlice } from 'modules/player/store/store'
import { graphqlAPISlice, restAPISlice } from 'api/api'
import { librarySlice } from 'modules/library/store'
import { browserSlice } from 'modules/browser/store'
import { playlistSlice } from 'modules/collections/store'
import { settingsSlice } from 'modules/settings/store'
import { dashboardSlice } from 'modules/dashboard/store'

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we don't need to call `combineReducers`.
const rootReducer = combineSlices(
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

export default rootReducer
