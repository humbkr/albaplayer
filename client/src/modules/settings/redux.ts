import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api, apolloClient } from 'api'
import { initLibrary } from 'modules/library/redux'
// eslint-disable-next-line import/named
import { AppThunk } from 'store/types'

interface Settings {
  libraryPath: string
  coversPreferredSource: string
  disableLibrarySettings: boolean
  version: string
}

export interface BrowserStateType {
  library: {
    isUpdating: boolean
    error: string
    config: Settings | {}
  }
  theme: string
}

export const initialState: BrowserStateType = {
  library: {
    isUpdating: false,
    error: '',
    config: {},
  },
  theme: 'default',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    init(state, action: PayloadAction<Settings>) {
      state.library.error = ''
      state.library.config = action.payload
    },
    libraryUpdateStart(state) {
      state.library.error = ''
      state.library.isUpdating = true
    },
    libraryUpdateSuccess(state) {
      state.library.error = ''
      state.library.isUpdating = false
    },
    libraryUpdateFailure(state, action: PayloadAction<string>) {
      state.library.error = action.payload
      state.library.isUpdating = false
    },
    libraryEraseStart(state) {
      state.library.error = ''
      state.library.isUpdating = true
    },
    libraryEraseSuccess(state) {
      state.library.error = ''
      state.library.isUpdating = false
    },
    libraryEraseFailure(state, action: PayloadAction<string>) {
      state.library.error = action.payload
      state.library.isUpdating = false
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload
    },
  },
})

export const {
  init,
  libraryUpdateStart,
  libraryUpdateSuccess,
  libraryUpdateFailure,
  libraryEraseStart,
  libraryEraseSuccess,
  libraryEraseFailure,
  setTheme,
} = settingsSlice.actions
export default settingsSlice.reducer

export const initSettings = (): AppThunk => (dispatch) => api
  .getSettings()
  .then((response) => {
    dispatch(init(response.data.settings))
  })
  .catch((response) => {
    dispatch(libraryUpdateFailure(api.processApiError(response)))
  })

export const updateLibrary = (): AppThunk => (dispatch) => {
  // First the app state is updated to inform that the API call is starting.
  dispatch(libraryUpdateStart())

  // Then we make the API call.
  return api
    .scanLibrary()
    .then(() => {
      // TODO: not fan of calling apolloClient here.
      apolloClient.resetStore().then(() => {
        dispatch(libraryUpdateSuccess())
        dispatch(initLibrary(true))
      })
    })
    .catch((response) => {
      dispatch(libraryUpdateFailure(api.processApiError(response)))
    })
}

export const eraseLibrary = (): AppThunk => (dispatch) => {
  // First the app state is updated to inform that the API call is starting.
  dispatch(libraryEraseStart())

  // Then we make the API call.
  return api
    .emptyLibrary()
    .then(() => {
      // TODO: not fan of calling apolloClient here.
      apolloClient.resetStore().then(() => {
        dispatch(libraryEraseSuccess())
        dispatch(initLibrary(true))
      })
    })
    .catch((response) => {
      dispatch(libraryEraseFailure(api.processApiError(response)))
    })
}
