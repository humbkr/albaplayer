import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initLibrary } from 'modules/library/store'
import libraryAPI from 'modules/library/api'
import { processApiError } from 'api/helpers'
import api from 'api/api'
import { SETTINGS_BROWSER_ONCLICK } from 'modules/settings/constants'

type Settings = {
  libraryPath: string
  coversPreferredSource: string
  disableLibrarySettings: boolean
  version: string
}

export type SettingsStateType = {
  library: {
    isUpdating: boolean
    error: string
    config: Settings | {}
  }
  theme: string
  browser: {
    onClickBehavior: SETTINGS_BROWSER_ONCLICK
  }
}

export const initialState: SettingsStateType = {
  library: {
    isUpdating: false,
    error: '',
    config: {},
  },
  theme: 'default',
  browser: {
    onClickBehavior: SETTINGS_BROWSER_ONCLICK.play,
  },
}

const updateLibrary = createAsyncThunk(
  'settings/updateLibrary',
  async (_, thunkAPI) => {
    const response = await libraryAPI.scanLibrary()

    // TODO: reset rtkQuery cache.

    thunkAPI.dispatch(initLibrary(true))

    return response.data
  }
)

const eraseLibrary = createAsyncThunk(
  'settings/eraseLibrary',
  async (_, thunkAPI) => {
    const response = await libraryAPI.emptyLibrary()

    // TODO: reset rtkQuery cache.

    thunkAPI.dispatch(initLibrary(true))

    return response.data
  }
)

const initSettings = createAsyncThunk('settings/init', async () => {
  const response = await api.getSettings()

  return response.data.settings
})

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload
    },
    setBrowserSettings(
      state,
      action: PayloadAction<Partial<SettingsStateType['browser']>>
    ) {
      state.browser = { ...state.browser, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initSettings.pending, (state) => {
      state.library.error = ''
      state.library.isUpdating = true
    })
    builder.addCase(initSettings.fulfilled, (state, action) => {
      state.library.error = ''
      state.library.config = action.payload
      state.library.isUpdating = false
    })
    builder.addCase(initSettings.rejected, (state, action) => {
      state.library.error = processApiError(action.payload)
      state.library.isUpdating = false
    })
    builder.addCase(updateLibrary.pending, (state) => {
      state.library.error = ''
      state.library.isUpdating = true
    })
    builder.addCase(updateLibrary.fulfilled, (state) => {
      state.library.error = ''
      state.library.isUpdating = false
    })
    builder.addCase(updateLibrary.rejected, (state, action) => {
      state.library.error = processApiError(action.payload)
      state.library.isUpdating = false
    })
    builder.addCase(eraseLibrary.pending, (state) => {
      state.library.error = ''
      state.library.isUpdating = true
    })
    builder.addCase(eraseLibrary.fulfilled, (state) => {
      state.library.error = ''
      state.library.isUpdating = false
    })
    builder.addCase(eraseLibrary.rejected, (state, action) => {
      state.library.error = processApiError(action.payload)
      state.library.isUpdating = false
    })
  },
})

export { initSettings, updateLibrary, eraseLibrary }
export const { setTheme, setBrowserSettings } = settingsSlice.actions
export default settingsSlice.reducer
