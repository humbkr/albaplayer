import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import libraryReducer from '../modules/library/redux'
import libraryBrowserReducer from '../modules/browser/redux'
import playerReducer from '../modules/player/redux'
import playlistReducer from '../modules/playlist/redux'
import settingsReducer from '../modules/settings/redux'
import dashboardReducer from '../modules/dashboard/redux'

const settingsPersistConfig = {
  key: 'settings',
  storage,
  whitelist: ['theme'],
}

const playerPersistConfig = {
  key: 'player',
  storage,
  whitelist: ['repeat', 'shuffle', 'volume'],
}

const rootReducer = combineReducers({
  library: libraryReducer,
  libraryBrowser: libraryBrowserReducer,
  queue: playerReducer.queue,
  player: persistReducer(playerPersistConfig, playerReducer.player),
  playlist: playlistReducer,
  dashboard: dashboardReducer,
  settings: persistReducer(settingsPersistConfig, settingsReducer),
})

export default rootReducer
