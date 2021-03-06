import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
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
import rootReducer from './rootReducer'
import migrations from './migrations'

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

// @ts-ignore
const store = configureStore({
  reducer: persistanceReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      // Ignore non serializable data for redux-persist actions.
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
    // Note: if you want to use a huge music library in development, uncomment the following lines.
    // serializableCheck: false,
    // immutableCheck: false,
  }),
  devTools: process.env.NODE_ENV !== 'production',
})

const persistor = persistStore(store)

export default store
export { persistor }
