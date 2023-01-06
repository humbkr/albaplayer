import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { graphQLApi } from 'api/api'
import { setupListeners } from '@reduxjs/toolkit/query'
import rootReducer from './rootReducer'
import migrations from './migrations'

const debugModeEnabled = process.env.REACT_APP_DEBUG_MODE === 'true'

// @ts-ignore
const persistanceReducer = persistReducer(
  {
    key: 'root',
    storage,
    whitelist: ['playlist'],
    version: 0,
    migrate: createMigrate(migrations.rootMigrations, {
      debug: process.env.REACT_APP_DEBUG_MODE === 'true',
    }),
  },
  rootReducer
)

const middleware = [graphQLApi.middleware]

const defaultMiddlewareOptions = {
  serializableCheck: debugModeEnabled
    ? {
        // Ignore non serializable data for redux-persist actions.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    : false,
  immutableCheck: debugModeEnabled,
}

// @ts-ignore
const store = configureStore({
  reducer: persistanceReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(defaultMiddlewareOptions).concat(...middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

const persistor = persistStore(store)

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors.
setupListeners(store.dispatch)

export default store
export { persistor }
