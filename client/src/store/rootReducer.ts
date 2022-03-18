import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import libraryReducer from '../modules/library/store'
import libraryBrowserReducer from '../modules/browser/store'
import playerReducer from '../modules/player/store'
import playlistReducer from '../modules/playlist/store'
import settingsReducer from '../modules/settings/store'
import dashboardReducer from '../modules/dashboard/store'

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
