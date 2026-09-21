import { createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { initLibrary } from 'modules/library/store'
import libraryAPI from 'modules/library/api'
import { processApiError } from 'api/helpers'
import { getSettings } from 'api/api'
import {
  SETTINGS_BROWSER_ONCLICK,
  SETTINGS_BROWSER_TRACKS_PANE_DISPLAY,
} from 'modules/settings/constants'
import { createAppSlice } from 'store/createAppSlice'

type Settings = {
  libraryPath: string
  coversPreferredSource: string
  disableLibrarySettings: boolean
  version: string
}

export type ScanProgress = {
  filesProcessed: number
  filesTotal: number
}

export type SettingsStateType = {
  library: {
    isUpdating: boolean
    scanProgress: ScanProgress
    error: string
    config: Settings | object
  }
  theme: string
  browser: {
    onClickBehavior: SETTINGS_BROWSER_ONCLICK
    tracksPaneDisplay: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY
  }
}

export const initialState: SettingsStateType = {
  library: {
    isUpdating: false,
    scanProgress: { filesProcessed: 0, filesTotal: 0 },
    error: '',
    config: {},
  },
  theme: 'default',
  browser: {
    onClickBehavior: SETTINGS_BROWSER_ONCLICK.play,
    tracksPaneDisplay: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY.albumInfo,
  },
}

const updateLibrary = createAsyncThunk('settings/updateLibrary', async () => {
  const response = await libraryAPI.scanLibrary()

  return response.data
})

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
  const response = await getSettings()

  return response.data.settings
})

export const settingsSlice = createAppSlice({
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
    setScanProgress(state, action: PayloadAction<ScanProgress>) {
      state.library.scanProgress = action.payload
      state.library.isUpdating = true
    },
    setLibraryNotUpdating(state) {
      state.library.isUpdating = false
      state.library.scanProgress = { filesProcessed: 0, filesTotal: 0 }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initSettings.fulfilled, (state, action) => {
      state.library.error = ''
      state.library.config = action.payload
    })
    builder.addCase(initSettings.rejected, (state, action) => {
      state.library.error = processApiError(action.payload)
    })
    builder.addCase(updateLibrary.pending, (state) => {
      state.library.error = ''
      state.library.isUpdating = true
    })
    builder.addCase(updateLibrary.fulfilled, (state) => {
      state.library.error = ''
      // IsUpdating stays true — the scan runs asynchronously on the server.
      // Polling will set it to false when the scan completes.
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
export const {
  setTheme,
  setBrowserSettings,
  setScanProgress,
  setLibraryNotUpdating,
} = settingsSlice.actions
