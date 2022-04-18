import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from 'api'

export type LibraryStateType = {
  isFetching: boolean
  isUpdating: boolean
  error: string
  isInitialized: boolean
  initHasFailed: boolean
  lastScan: string
  artists: { [id: string]: Artist }
  albums: { [id: string]: Album }
  tracks: { [id: string]: Track }
}

export const libraryInitialState: LibraryStateType = {
  isFetching: false,
  isUpdating: false,
  error: '',
  isInitialized: false,
  initHasFailed: false,
  lastScan: '',
  artists: {},
  albums: {},
  tracks: {},
}

const initLibrary = createAsyncThunk(
  'library/init',
  async (force: boolean, thunkAPI) => {
    const state = thunkAPI.getState() as { library: LibraryStateType }

    if (force || (await shouldFetchLibrary(state.library))) {
      return thunkAPI.dispatch(fetchLibrary())
    }

    return null
  }
)

const fetchLibrary = createAsyncThunk('library/fetch', async (_, thunkAPI) => {
  const response = await api.getLibrary()

  if (response?.data.variable?.value) {
    thunkAPI.dispatch(setLastScan(response.data.variable.value))
  }

  return response?.data
})

const librarySlice = createSlice({
  name: 'library',
  initialState: libraryInitialState,
  reducers: {
    setLastScan(state, action: PayloadAction<string>) {
      state.lastScan = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLibrary.pending, (state) => {
      state.isFetching = true
    })
    builder.addCase(fetchLibrary.fulfilled, (state, action) => {
      const data = action.payload

      // Transform the lists into objects.
      const artists: { [id: string]: Artist } = {}
      const albums: { [id: string]: Album } = {}
      const tracks: { [id: string]: Track } = {}

      if (data?.artists) {
        data.artists.forEach((item) => {
          artists[item.id] = item
        })
      }

      if (data?.albums) {
        data.albums.forEach((item) => {
          albums[item.id] = item
        })
      }

      if (data?.tracks) {
        data.tracks.forEach((item) => {
          tracks[item.id] = item
        })
      }

      state.isFetching = false
      state.isInitialized = true
      state.artists = artists
      state.albums = albums
      state.tracks = tracks
    })
    builder.addCase(fetchLibrary.rejected, (state) => {
      state.isFetching = false
      state.isInitialized = false
      state.initHasFailed = true
    })
  },
})

export { initLibrary, fetchLibrary }
export const { setLastScan } = librarySlice.actions
export default librarySlice.reducer

// TODO: not working
export const shouldFetchLibrary = async (libraryState: LibraryStateType) => {
  // If the library is currently fetching, nothing to do.
  if (libraryState.isFetching) {
    return false
  }

  // If there is no trace of a previous successful fetch, we have to fetch.
  if (!libraryState.lastScan) {
    return true
  }

  // Get last scan date from backend. If backend last scan > local version, we
  // have to fetch.
  try {
    const response = await api.getVariable('library_last_updated')
    if (response?.data?.variable?.value) {
      const remoteLastScan = response.data.variable.value
      return remoteLastScan > libraryState.lastScan
    }
  } catch (e) {
    // Fail through.
  }

  return true
}
