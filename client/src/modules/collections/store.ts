import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum PLAYLIST_PANE {
  detail = 'detail',
  fix = 'fix',
}

export type PlaylistsStateType = {
  currentPlaylist: string
  currentTrack?: {
    id: string
    position: number
  }
  currentPane: PLAYLIST_PANE
}

export const playlistsInitialState: PlaylistsStateType = {
  currentPlaylist: '',
  currentTrack: undefined,
  currentPane: PLAYLIST_PANE.detail,
}

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: playlistsInitialState,
  reducers: {
    playlistSelectPlaylist(state, action: PayloadAction<string>) {
      state.currentPlaylist = action.payload
      state.currentTrack = undefined
      state.currentPane = PLAYLIST_PANE.detail
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
    playlistChangePane(state, action: PayloadAction<PLAYLIST_PANE>) {
      state.currentPane = action.payload
    },
  },
})

export const {
  playlistSelectPlaylist,
  playlistSelectTrack,
  playlistChangePane,
} = playlistSlice.actions
export default playlistSlice.reducer
