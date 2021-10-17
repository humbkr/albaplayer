import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from 'api'
import { AppThunk } from 'store/types'

export interface LibraryStateType {
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

const librarySlice = createSlice({
  name: 'library',
  initialState: libraryInitialState,
  reducers: {
    initStart(state) {
      state.isFetching = true
    },
    initSuccess(
      state,
      action: PayloadAction<{
        artists: Artist[]
        albums: Album[]
        tracks: Track[]
      }>
    ) {
      const data = action.payload

      // Here we have to make up for the fact that we cannot request albums with artist names
      // from the backend without severe performance penalty. We have to populate the information
      // client-side from the artists list we got from the backend.
      const hydratedAlbums: Album[] = data.albums.map((album) => {
        const artists = data.artists.filter(
          (artist) => album.artistId === artist.id
        )
        let artistName = ''
        if (artists.length > 0) {
          artistName = artists[0].name
        }

        return { ...album, artistName }
      })

      // Transform the lists into objects.
      const artists: { [id: string]: Artist } = {}
      const albums: { [id: string]: Album } = {}
      const tracks: { [id: string]: Track } = {}
      data.artists.forEach((item) => {
        artists[item.id] = item
      })
      hydratedAlbums.forEach((item) => {
        albums[item.id] = item
      })
      data.tracks.forEach((item) => {
        tracks[item.id] = item
      })

      state.isFetching = false
      state.isInitialized = true
      state.artists = artists
      state.albums = albums
      state.tracks = tracks
    },
    initFailure(state) {
      state.isFetching = false
      state.isInitialized = false
      state.initHasFailed = true
    },
    setLastScan(state, action: PayloadAction<string>) {
      state.lastScan = action.payload
    },
  },
})

export const {
  initStart,
  initSuccess,
  initFailure,
  setLastScan,
} = librarySlice.actions
export default librarySlice.reducer

export const initLibrary = (force: boolean = false): AppThunk => async (
  dispatch,
  getState
) => {
  if (force || (await shouldFetchLibrary(getState().library))) {
    return dispatch(fetchLibrary())
  }
  return null
}

export const fetchLibrary = (): AppThunk => (dispatch) => {
  // First the app state is updated to inform that the API call is starting.
  dispatch(initStart())

  // Then we make the API call.
  return api
    .getLibrary()
    .then((response) => {
      dispatch(initSuccess(response.data))
      if (response.data.variable) {
        dispatch(setLastScan(response.data.variable.value))
      }
    })
    .catch(() => {
      dispatch(initFailure())
    })
}

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
