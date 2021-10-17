import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { immutableNestedSort, immutableSortTracks } from 'common/utils/utils'
import { constants as APIConstants } from 'api'
import { AppThunk, RootState } from '../../store/types'

export const browserInitialState: BrowserState = {
  artists: [],
  albums: [],
  tracks: [],
  sortArtists: 'name',
  sortAlbums: 'title',
  sortTracks: 'number',
  selectedArtists: '0',
  selectedAlbums: '0',
  selectedTracks: '0',
  currentPositionArtists: 0,
  currentPositionAlbums: 0,
  currentPositionTracks: 0,
  search: {
    term: '',
    filter: 'all',
    filteredArtists: [],
    filteredAlbums: [],
    filteredTracks: [],
  },
}

const browserSlice = createSlice({
  name: 'libraryBrowser',
  initialState: browserInitialState,
  reducers: {
    libraryBrowserInitArtists(
      state: BrowserState,
      action: PayloadAction<Artist[]>
    ) {
      state.artists = action.payload
    },
    libraryBrowserSelectArtist(
      state: BrowserState,
      action: PayloadAction<{
        artistId: string
        index: number
        filteredAlbums: Album[]
        filteredTracks: Track[]
      }>
    ) {
      state.selectedAlbums = '0'
      state.selectedTracks = '0'
      state.selectedArtists = action.payload.artistId
      state.currentPositionArtists = action.payload.index
      state.currentPositionAlbums = 0
      state.currentPositionTracks = 0
      state.albums = action.payload.filteredAlbums
      state.tracks = action.payload.filteredTracks
    },
    libraryBrowserSelectAlbum(
      state: BrowserState,
      action: PayloadAction<{
        albumId: string
        index: number
        filteredTracks: Track[]
      }>
    ) {
      state.selectedTracks = '0'
      state.selectedAlbums = action.payload.albumId
      state.currentPositionAlbums = action.payload.index
      state.currentPositionTracks = 0
      state.tracks = action.payload.filteredTracks
    },
    libraryBrowserSelectTrack(
      state: BrowserState,
      action: PayloadAction<{
        trackId: string
        index: number
      }>
    ) {
      state.selectedTracks = action.payload.trackId
      state.currentPositionTracks = action.payload.index
    },
    libraryBrowserSortArtists(
      state: BrowserState,
      action: PayloadAction<ArtistsSortOptions>
    ) {
      state.sortArtists = action.payload
    },
    libraryBrowserSortAlbums(
      state: BrowserState,
      action: PayloadAction<AlbumsSortOptions>
    ) {
      state.sortAlbums = action.payload
    },
    libraryBrowserSortTracks(
      state: BrowserState,
      action: PayloadAction<TracksSortOptions>
    ) {
      state.sortTracks = action.payload
    },
    libraryBrowserSearchUpdateInput(
      state: BrowserState,
      action: PayloadAction<string>
    ) {
      state.search.term = action.payload
    },
    libraryBrowserSearchFilter(
      state: BrowserState,
      action: PayloadAction<{
        searchTerm: string
        filteredArtists: Artist[]
        filteredAlbums: Album[]
        filteredTracks: Track[]
      }>
    ) {
      // Reset previously selected stuff.
      state.selectedArtists = '0'
      state.selectedAlbums = '0'
      state.selectedTracks = '0'
      state.currentPositionArtists = 0
      state.currentPositionAlbums = 0
      state.currentPositionTracks = 0
      // Set search filtered lists and term in memory.
      state.search = {
        term: action.payload.searchTerm,
        filter: state.search.filter,
        filteredArtists: action.payload.filteredArtists,
        filteredAlbums: action.payload.filteredAlbums,
        filteredTracks: action.payload.filteredTracks,
      }
      // Set display lists.
      state.artists = action.payload.filteredArtists
      state.albums = action.payload.filteredAlbums
      state.tracks = action.payload.filteredTracks
    },
    libraryBrowserSetFilter(
      state: BrowserState,
      action: PayloadAction<SearchFilter>
    ) {
      state.search.filter = action.payload
    },
  },
})

export const {
  libraryBrowserSelectArtist,
  libraryBrowserSelectAlbum,
  libraryBrowserSearchUpdateInput,
  libraryBrowserSearchFilter,
  libraryBrowserSetFilter,
  libraryBrowserInitArtists,
  libraryBrowserSelectTrack,
  libraryBrowserSortArtists,
  libraryBrowserSortAlbums,
  libraryBrowserSortTracks,
} = browserSlice.actions
export default browserSlice.reducer

/*
 * Called when loading the browser pane.
 */
export const libraryBrowserInit = (): AppThunk => (dispatch, getState) => {
  const state = getState()
  dispatch(initArtists())
  dispatch(
    selectArtist({
      artistId: state.libraryBrowser.selectedArtists,
      index: state.libraryBrowser.currentPositionArtists,
    })
  )
  dispatch(
    selectAlbum({
      albumId: state.libraryBrowser.selectedAlbums,
      index: state.libraryBrowser.currentPositionAlbums,
    })
  )
  dispatch(
    libraryBrowserSelectTrack({
      trackId: state.libraryBrowser.selectedTracks,
      index: state.libraryBrowser.currentPositionTracks,
    })
  )
}

export const initArtists = (): AppThunk => (dispatch, getState) => {
  const state = getState()
  const artists = state.libraryBrowser.search.term === ''
    ? Object.values(state.library.artists)
    : state.libraryBrowser.search.filteredArtists

  dispatch(libraryBrowserInitArtists(artists))
}

export const search = (text: string): AppThunk => (dispatch) => {
  dispatch(libraryBrowserSearchUpdateInput(text))

  // Launch the search only if user has typed 3 or more characters.
  if (text.length > 2) {
    dispatch(searchFilter(text))
  } else if (text.length === 0) {
    // Reinitialise library browser.
    dispatch(selectArtist({ artistId: '0', index: 0 }))
    // Others tabs will be reinitialised automatically.
    dispatch(libraryBrowserInit())
  }
}

export const setSearchFilter = (filter: SearchFilter): AppThunk => (
  dispatch,
  getState
) => {
  const {
    libraryBrowser: {
      search: { term },
    },
  } = getState()

  dispatch(libraryBrowserSetFilter(filter))

  if (term.length > 2) {
    dispatch(searchFilter(term))
  }
}

export const selectArtist = ({
  artistId,
  index,
}: {
  artistId: string
  index: number
}): AppThunk => (dispatch, getState) => {
  const { libraryBrowser, library } = getState()

  let filteredAlbums: Album[] = []
  let filteredTracks: Track[] = []

  const userHasSearched = libraryBrowser.search.term !== ''

  // If the user has searched for something, the filtering is done only on the results already
  // filtered from the search term. Else we filter on the original library.
  let albumsToFilter
  if (userHasSearched) {
    albumsToFilter = [...libraryBrowser.search.filteredAlbums]
  } else {
    albumsToFilter = Object.values<Album>(library.albums)
  }

  let tracksToFilter
  if (userHasSearched) {
    tracksToFilter = [...libraryBrowser.search.filteredTracks]
  } else {
    tracksToFilter = Object.values<Track>(library.tracks)
  }

  if (artistId !== '0') {
    if (artistId === APIConstants.COMPILATION_ARTIST_ID) {
      // Special case for compilations which are grouped under the "Various artists" artist.
      filteredAlbums = albumsToFilter.filter(
        (item) => item.artistId === artistId
      )
      // We have to get all the tracks from all the compilation albums.
      const albumsIds = filteredAlbums.map((item) => item.id)
      filteredTracks = tracksToFilter.filter((item) => albumsIds.includes(item.albumId))
    } else {
      // To display all the albums containing tracks of an artist, including
      // the compilations, we can't directly filter albums on artistId, we have
      // to instead display all the albums for which tracks have been found.
      filteredTracks = tracksToFilter.filter(
        (item) => item.artistId === artistId
      )
      const tracksAlbums = filteredTracks.map((item) => item.albumId)
      filteredAlbums = albumsToFilter.filter(
        (item) => artistId === '0' || tracksAlbums.includes(item.id)
      )
    }
  } else {
    // Display all albums.
    filteredAlbums = albumsToFilter
    // If user searched for something display all already filtered tracks.
    if (userHasSearched) {
      filteredTracks = tracksToFilter
    }
  }

  const hydratedAlbums = filteredAlbums.map((album) => ({
    ...album,
    artist: library.artists[album.artistId],
  }))

  const hydratedTracks = filteredTracks.map((track) => ({
    ...track,
    artist: library.artists[track.artistId],
    album: library.albums[track.albumId],
  }))

  dispatch(
    libraryBrowserSelectArtist({
      artistId,
      index,
      filteredAlbums: hydratedAlbums,
      filteredTracks: hydratedTracks,
    })
  )
}

export const selectAlbum = ({
  albumId,
  index,
}: {
  albumId: string
  index: number
}): AppThunk => (dispatch, getState) => {
  const { libraryBrowser, library } = getState()

  let filteredTracks: Track[] = []
  let compilationsIds: string[] = []

  const userHasSearched = libraryBrowser.search.term !== ''

  let tracksToFilter
  if (userHasSearched) {
    tracksToFilter = [...libraryBrowser.search.filteredTracks]
  } else {
    tracksToFilter = Object.values<Track>(library.tracks)
  }

  if (libraryBrowser.selectedArtists === APIConstants.COMPILATION_ARTIST_ID) {
    // We want to display all tracks for all the compilations, keep track (hoho) of the albums
    // being compilations.
    compilationsIds = libraryBrowser.albums.map((item: Album) => item.id)
  }

  if (libraryBrowser.selectedArtists !== '0' || albumId !== '0') {
    filteredTracks = tracksToFilter.filter((item) => {
      if (
        libraryBrowser.selectedArtists === APIConstants.COMPILATION_ARTIST_ID
        && albumId === '0'
      ) {
        // If "various artists" artist selected and no specific album selected,
        // Display all tracks for all the compilations.
        return compilationsIds.includes(item.albumId)
      }
      if (
        libraryBrowser.selectedArtists === APIConstants.COMPILATION_ARTIST_ID
      ) {
        // If "various artists" artist selected and specific album selected,
        // Display all tracks for this album.
        return item.albumId === albumId
      }
      if (libraryBrowser.selectedArtists !== '0' && albumId === '0') {
        // If no specific album selected, display all the tracks of
        // the selected artist for all albums of this artist.
        return item.artistId === libraryBrowser.selectedArtists
      }
      if (libraryBrowser.selectedArtists === '0') {
        // If no artist selected, display all the tracks
        // for the selected album.
        return item.albumId === albumId
      }

      // Else return the tracks for the selected album and artist.
      return (
        item.albumId === albumId
        && item.artistId === libraryBrowser.selectedArtists
      )
    })
  } else if (userHasSearched) {
    // If user searched for something display all already filtered tracks.
    filteredTracks = tracksToFilter
  }

  const hydratedTracks = filteredTracks.map((track) => ({
    ...track,
    artist: library.artists[track.artistId],
    album: library.albums[track.albumId],
  }))

  dispatch(
    libraryBrowserSelectAlbum({
      albumId,
      index,
      filteredTracks: hydratedTracks,
    })
  )
}

/**
 * Search thunk.
 *
 * Filters:
 *   - tracks on title
 *   - albums on title
 *   - artists on name
 * - For the tracks, the album containing a found track and the artist will then be included in
 *   the results.
 * - For the albums, the artist of a found album AND all the tracks for this album will then be
 *   included in the results.
 * - For the artists, all the albums and all the tracks for this artist will then be
 *   included in the results.
 *
 */
export const searchFilter = (searchTerm: string): AppThunk => (
  dispatch,
  getState
) => {
  const state = getState()

  // Get library lists as arrays.
  const libraryArtists = Object.values<Artist>(state.library.artists)
  const libraryAlbums = Object.values<Album>(state.library.albums)
  const libraryTracks = Object.values<Track>(state.library.tracks)

  // Artists and albums are updated with search results from respectively albums + tracks and
  // tracks so we can't directly filter the original lists.
  const artistsIds: string[] = []
  const albumsIds: string[] = []
  // Tracks list can be filtered directly though because we already have all the artists and
  // albums info we need at the moment of filtering the tracks list.
  const filteredTracks: Track[] = []

  // Get ids of all artists whose name is matching the search term.
  if (
    state.libraryBrowser.search.filter === 'all'
    || state.libraryBrowser.search.filter === 'artist'
  ) {
    libraryArtists.forEach((item) => {
      if (item.name.toUpperCase().includes(searchTerm.toUpperCase())) {
        artistsIds.push(item.id)
      }
    })
  }

  // Store artists and album ids that are not found with a direct match in separate variables.
  const undirectAlbumsIds: string[] = []
  const undirectArtistsIds: string[] = []
  // Special case for compilation albums.
  const compilationAlbums: string[] = []

  libraryAlbums.forEach((item) => {
    // Get ids of all albums whose title is matching the search term.
    if (
      state.libraryBrowser.search.filter === 'all'
      || state.libraryBrowser.search.filter === 'album'
    ) {
      if (item.title.toUpperCase().includes(searchTerm.toUpperCase())) {
        albumsIds.push(item.id)

        // Add album's artist id to the list of artists.
        if (item.artistId && !artistsIds.includes(item.artistId)) {
          undirectArtistsIds.push(item.artistId)
        }
      }
    }

    // Also get all albums of artists that have previously been found.
    if (item.artistId && artistsIds.includes(item.artistId)) {
      if (
        item.artistId === APIConstants.COMPILATION_ARTIST_ID
        && !compilationAlbums.includes(item.id)
      ) {
        // Track compilation albums separately.
        compilationAlbums.push(item.id)
      } else if (!albumsIds.includes(item.id)) {
        undirectAlbumsIds.push(item.id)
      }
    }
  })

  libraryTracks.forEach((item) => {
    // Also get all tracks of artists and albums that have previously been found.
    if (item.artistId && artistsIds.includes(item.artistId)) {
      if (!filteredTracks.includes(item)) {
        filteredTracks.push(item)
      }
    }
    if (item.albumId && albumsIds.includes(item.albumId)) {
      if (!filteredTracks.includes(item)) {
        filteredTracks.push(item)
      }
    }
    if (item.albumId && compilationAlbums.includes(item.albumId)) {
      if (!filteredTracks.includes(item)) {
        filteredTracks.push(item)
      }
    }

    // Get ids of all tracks whose title is matching the search term.
    if (
      state.libraryBrowser.search.filter === 'all'
      || state.libraryBrowser.search.filter === 'track'
    ) {
      if (item.title.toUpperCase().includes(searchTerm.toUpperCase())) {
        if (!filteredTracks.includes(item)) {
          filteredTracks.push(item)
        }

        // Add track's artist id to the list of artists.
        if (item.artistId && !undirectArtistsIds.includes(item.artistId)) {
          undirectArtistsIds.push(item.artistId)
        }

        // Add track's album id to the list of albums.
        if (item.albumId && !undirectAlbumsIds.includes(item.albumId)) {
          undirectAlbumsIds.push(item.albumId)
        }
      }
    }
  })

  // Add back artists added from album matching.
  undirectArtistsIds.forEach((item) => {
    if (!artistsIds.includes(item)) {
      artistsIds.push(item)
    }
  })

  // Add back albums added from artists matching.
  undirectAlbumsIds.forEach((item) => {
    if (!albumsIds.includes(item)) {
      albumsIds.push(item)
    }
  })
  compilationAlbums.forEach((item) => {
    if (!albumsIds.includes(item)) {
      albumsIds.push(item)
    }
  })

  // Then filter the artists and albums.
  const filteredArtists = libraryArtists.filter((item) => artistsIds.includes(item.id))
  const filteredAlbums = libraryAlbums.filter((item) => albumsIds.includes(item.id))

  // Hydrate elements.
  const hydratedAlbums = filteredAlbums.map((album) => ({
    ...album,
    artist: state.library.artists[album.artistId],
  }))

  const hydratedTracks = filteredTracks.map((track) => ({
    ...track,
    artist: state.library.artists[track.artistId],
    album: state.library.albums[track.albumId],
  }))

  dispatch(
    libraryBrowserSearchFilter({
      searchTerm,
      filteredArtists,
      filteredAlbums: hydratedAlbums,
      filteredTracks: hydratedTracks,
    })
  )
}

const getArtists = (state: RootState) => state.libraryBrowser.artists
const getArtistsSortOrder = (state: RootState) => state.libraryBrowser.sortArtists
export const getArtistsList = createSelector(
  [getArtists, getArtistsSortOrder],
  (list: Artist[], sortOrder: SortOrder) => {
    const itemList = immutableNestedSort(list, sortOrder)

    // Add a "All" item at the beginning of the list
    const itemAll = {
      id: '0',
      name: 'All',
      title: 'All',
      artistId: '0',
      albumId: '0',
    }
    itemList.unshift(itemAll)

    return itemList
  }
)

const getAlbums = (state: RootState) => state.libraryBrowser.albums
const getAlbumsSortOrder = (state: RootState) => state.libraryBrowser.sortAlbums
export const getAlbumsList = createSelector(
  [getAlbums, getAlbumsSortOrder],
  (list: Album[], sortOrder: SortOrder) => {
    const itemList = immutableNestedSort(list, sortOrder)

    // Add a "All" item at the beginning of the list
    const itemAll = {
      id: '0',
      name: 'All',
      title: 'All',
      artistId: '0',
      albumId: '0',
    }
    itemList.unshift(itemAll)

    return itemList
  }
)

const getTracks = (state: RootState) => state.libraryBrowser.tracks
const getTracksSortOrder = (state: RootState) => state.libraryBrowser.sortTracks
export const getTracksList = createSelector(
  [getTracks, getTracksSortOrder],
  (list: Track[], sortOrder: SortOrder) => {
    const itemList = immutableSortTracks(list, sortOrder)

    // Add a "All" item at the beginning of the list
    const itemAll = {
      id: '0',
      name: 'All',
      title: 'All',
      artistId: '0',
      albumId: '0',
    }
    itemList.unshift(itemAll)

    return itemList
  }
)
