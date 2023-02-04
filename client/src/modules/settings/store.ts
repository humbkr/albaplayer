import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from 'api'
import { initLibrary } from 'modules/library/store'

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
}

export const initialState: SettingsStateType = {
  library: {
    isUpdating: false,
    error: '',
    config: {},
  },
  theme: 'default',
}

const updateLibrary = createAsyncThunk(
  'settings/updateLibrary',
  async (_, thunkAPI) => {
    const response = await api.scanLibrary()

    // TODO: reset rtkQuery cache.

    thunkAPI.dispatch(initLibrary(true))

    return response.data
  }
)

const eraseLibrary = createAsyncThunk(
  'settings/eraseLibrary',
  async (_, thunkAPI) => {
    const response = await api.emptyLibrary()

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
      state.library.error = api.processApiError(action.payload)
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
      state.library.error = api.processApiError(action.payload)
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
      state.library.error = api.processApiError(action.payload)
      state.library.isUpdating = false
    })
  },
})

export { initSettings, updateLibrary, eraseLibrary }
export const { setTheme } = settingsSlice.actions
export default settingsSlice.reducer
