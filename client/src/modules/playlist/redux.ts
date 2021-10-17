import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getRandomInt, immutableNestedSort } from 'common/utils/utils'
import dayjs from 'dayjs'
import { AppThunk, RootState } from '../../store/types'
import { QueueItem } from '../player/types'

export enum PlaylistPane {
  Detail,
  Fix,
}

export interface PlaylistsStateType {
  playlists: { [id: string]: Playlist }
  currentPlaylist: {
    playlist: Playlist | null
    position: number
  }
  currentTrack: {
    id: string
    position: number
  }
  currentPane: PlaylistPane
}

export const playlistsInitialState: PlaylistsStateType = {
  playlists: {},
  currentPlaylist: {
    playlist: null,
    position: 0,
  },
  currentTrack: {
    id: '0',
    position: 0,
  },
  currentPane: PlaylistPane.Detail,
}

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: playlistsInitialState,
  reducers: {
    playlistSelectPlaylist(state, action) {
      state.currentPlaylist = {
        playlist: action.payload.selectedPlaylist,
        position: action.payload.playlistIndex,
      }
      state.currentTrack = {
        id: '0',
        position: 0,
      }
      state.currentPane = PlaylistPane.Detail
    },
    playlistCreatePlaylist(state, action: PayloadAction<Playlist>) {
      const newList = { ...state.playlists }
      newList[action.payload.id] = action.payload

      state.playlists = newList
      state.currentPlaylist = {
        playlist: action.payload,
        position: Object.values(newList).length - 1,
      }
    },
    playlistDeletePlaylist(state, action: PayloadAction<Playlist>) {
      const newList = { ...state.playlists }
      delete newList[action.payload.id]

      let newCurrentPlaylist = { ...state.currentPlaylist }
      if (state.currentPlaylist.playlist?.id === action.payload.id) {
        // We deleted the current playlist, set current to the first  of
        // the list if there is one.
        if (Object.values(newList).length > 0) {
          newCurrentPlaylist = {
            playlist: Object.values(newList)[0],
            position: 0,
          }
        } else {
          newCurrentPlaylist = { playlist: null, position: 0 }
        }
      }

      state.playlists = newList
      state.currentPlaylist = newCurrentPlaylist
    },
    playlistSelectTrack(
      state,
      action: PayloadAction<{ trackId: string; trackIndex: number }>
    ) {
      state.currentTrack = {
        id: action.payload.trackId,
        position: action.payload.trackIndex,
      }
    },
    playlistRemoveTrack(
      state,
      action: PayloadAction<{ playlistId: string; trackPosition: number }>
    ) {
      // Remove selected track.
      let newTracklist = state.playlists[
        action.payload.playlistId
      ].items.filter((item) => item.position !== action.payload.trackPosition)

      // Reorder all tracks.
      let position = 0
      newTracklist = newTracklist.map((item) => {
        position++
        return { ...item, position }
      })

      const newPlaylists = { ...state.playlists }
      newPlaylists[action.payload.playlistId].items = newTracklist

      state.playlists = newPlaylists

      if (state.currentPlaylist.playlist) {
        state.currentPlaylist = {
          ...state.currentPlaylist,
          playlist: { ...newPlaylists[state.currentPlaylist.playlist.id] },
        }
      }
    },
    playlistAddTracks(
      state,
      action: PayloadAction<{ playlistId: string; tracks: Track[] }>
    ) {
      const { playlistId, tracks } = action.payload
      const newPlaylists = { ...state.playlists }

      // Add position in playlist to tracks.
      let position = newPlaylists[playlistId].items.length
      const augmentedTracks = tracks.map((track) => {
        position++
        return {
          track,
          position,
        }
      })

      // Add tracks to selected playlist.
      newPlaylists[playlistId].items.push(...augmentedTracks)

      state.playlists = newPlaylists

      // Update current playlist if this is the one we are working on.
      if (state.currentPlaylist.playlist?.id === playlistId) {
        state.currentPlaylist = {
          ...state.currentPlaylist,
          // @ts-ignore
          playlist: { ...newPlaylists[state.currentPlaylist.playlist.id] },
        }
      }
    },
    playlistUpdateItems(
      state,
      action: PayloadAction<{
        playlistId: string
        newItems: PlaylistItem[]
      }>
    ) {
      let position = 0
      const reorderedTracks = action.payload.newItems.map((item) => {
        position++
        return { ...item, position }
      })

      const newPlaylists = { ...state.playlists }
      newPlaylists[action.payload.playlistId].items = reorderedTracks

      state.playlists = newPlaylists

      if (state.currentPlaylist.playlist) {
        const newPlaylist = { ...state.currentPlaylist.playlist }
        if (action.payload.playlistId === state.currentPlaylist.playlist.id) {
          newPlaylist.items = reorderedTracks

          state.currentPlaylist = {
            ...state.currentPlaylist,
            playlist: newPlaylist,
          }
        }
      }
    },
    playlistUpdateInfo(state, action: PayloadAction<Playlist>) {
      const newPlaylists = { ...state.playlists }
      newPlaylists[action.payload.id] = action.payload

      state.playlists = newPlaylists

      if (state.currentPlaylist.playlist) {
        state.currentPlaylist = {
          ...state.currentPlaylist,
          playlist:
            action.payload.id === state.currentPlaylist.playlist.id
              ? action.payload
              : state.currentPlaylist.playlist,
        }
      }
    },
    playlistChangePane(state, action: PayloadAction<PlaylistPane>) {
      state.currentPane = action.payload
    },
  },
})

export const {
  playlistSelectPlaylist,
  playlistCreatePlaylist,
  playlistDeletePlaylist,
  playlistSelectTrack,
  playlistRemoveTrack,
  playlistAddTracks,
  playlistUpdateItems,
  playlistUpdateInfo,
  playlistChangePane,
} = playlistSlice.actions
export default playlistSlice.reducer

/**
 * Adds a track to a given playlist or create a new playlist with this track if no playlist id
 * is provided.
 */
export const addTrack = ({
  playlistId,
  trackId,
}: {
  playlistId?: string
  trackId: string
}): AppThunk => (dispatch, getState) => {
  const { library } = getState()

  // Get track info from the library.
  const track = { ...library.tracks[trackId] }
  // Hydrate track with album and artist info.
  track.artist = library.artists[track.artistId]
  track.album = library.albums[track.albumId]

  if (playlistId) {
    dispatch(playlistAddTracks({ playlistId, tracks: [track] }))
  } else {
    dispatch(createPlaylist({ name: 'New playlist', tracks: [track] }))
  }
}

/**
 * Adds an album to a given playlist or create a new playlist with this album if no playlist id
 * is provided.
 */
export const addAlbum = ({
  playlistId,
  albumId,
}: {
  playlistId?: string
  albumId: string
}): AppThunk => (dispatch, getState) => {
  const { library } = getState()

  // Get tracks from album.
  const filteredTracks = Object.values<Track>(library.tracks).filter(
    (track) => albumId === track.albumId
  )

  // Hydrate tracks with album and artist info.
  const augmentedTracks = filteredTracks.map((track) => ({
    ...track,
    artist: library.artists[track.artistId],
    album: library.albums[track.albumId],
  }))

  if (playlistId) {
    dispatch(playlistAddTracks({ playlistId, tracks: augmentedTracks }))
  } else {
    dispatch(createPlaylist({ name: 'New playlist', tracks: augmentedTracks }))
  }
}

/**
 * Adds an artist to a given playlist or create a new playlist with this artist if no playlist id
 * is provided.
 */
export const addArtist = ({
  playlistId,
  artistId,
}: {
  playlistId?: string
  artistId: string
}): AppThunk => (dispatch, getState) => {
  const { library } = getState()

  // Get tracks from artist.
  const filteredTracks = Object.values<Track>(library.tracks).filter(
    (track) => artistId === track.artistId
  )

  // Hydrate tracks with album and artist info.
  const augmentedTracks = filteredTracks.map((track) => ({
    ...track,
    artist: library.artists[track.artistId],
    album: library.albums[track.albumId],
  }))

  if (playlistId) {
    dispatch(playlistAddTracks({ playlistId, tracks: augmentedTracks }))
  } else {
    dispatch(createPlaylist({ name: 'New playlist', tracks: augmentedTracks }))
  }
}

/**
 * Adds a playlist to a given playlist or create a copy of this playlist if no playlist id
 * is provided.
 */
export const addPlaylist = ({
  playlistId,
  playlistToAddId,
}: {
  playlistId?: string
  playlistToAddId: string
}): AppThunk => (dispatch, getState) => {
  const { playlist } = getState()

  const tracks = playlist.playlists[playlistToAddId].items.map(
    (item: PlaylistItem) => item.track
  )

  if (playlistId) {
    dispatch(
      playlistAddTracks({
        playlistId,
        tracks,
      })
    )
  } else {
    dispatch(
      createPlaylist({
        name: `Copy of ${playlist.playlists[playlistToAddId].title}`,
        tracks,
      })
    )
  }
}

/**
 * Adds the current queue to a given playlist or create a new playlist with the queue if no
 * playlist id is provided.
 */
export const addCurrentQueue = ({
  playlistId,
}: {
  playlistId?: string
}): AppThunk => (dispatch, getState) => {
  const { queue } = getState()

  const tracks = queue.items.map((item: QueueItem) => item.track)

  if (playlistId) {
    dispatch(
      playlistAddTracks({
        playlistId,
        tracks,
      })
    )
  } else {
    dispatch(
      createPlaylist({
        name: 'New playlist from queue',
        tracks,
      })
    )
  }
}

export const createPlaylist = ({
  name,
  tracks,
}: {
  name: string
  tracks: Track[]
}): AppThunk => (dispatch) => {
  const playlistItems = tracks.map((item: Track, index: number) => ({
    track: item,
    position: index + 1,
  }))

  dispatch(
    playlistCreatePlaylist({
      id: `temp_${getRandomInt(1, 100000)}`,
      title: name,
      date: dayjs().format('YYYY-MM-DD'),
      items: playlistItems,
    })
  )
}

export const playlistsSelector = createSelector(
  [(state: RootState) => state.playlist.playlists],
  (list) => immutableNestedSort(Object.values(list), 'title')
)
