import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setCycleNumPos } from './utils'
import { PlayerPlaybackMode } from './types'

export interface PlayerStateType {
  // Controls and audio state.
  playing: boolean
  repeat: PlayerPlaybackMode
  shuffle: boolean
  volume: number
  volumeMuted: number
  duration: number
  progress: number
  // Track currently loaded in audio.
  track?: Track
}

export const playerInitialState: PlayerStateType = {
  playing: false,
  repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
  shuffle: false,
  volume: 1,
  volumeMuted: 1,
  duration: 0,
  progress: 0,
  track: undefined,
}

const playerSlice = createSlice({
  name: 'player',
  initialState: playerInitialState,
  reducers: {
    playerTogglePlayPause(state, action: PayloadAction<boolean>) {
      if (state.track || action.payload !== undefined) {
        state.playing = action.payload === undefined ? !state.playing : action.payload
      }
    },
    playerToggleShuffle(state) {
      state.shuffle = !state.shuffle
    },
    playerToggleRepeat(state) {
      state.repeat = setCycleNumPos(state.repeat, 1, 3)
    },
    playerSetVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload
    },
    playerSetTrack(state, action: PayloadAction<Track>) {
      state.track = action.payload
    },
    playerSetDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload
    },
    playerSetProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload
    },
  },
})

export const {
  playerTogglePlayPause,
  playerToggleShuffle,
  playerToggleRepeat,
  playerSetVolume,
  playerSetTrack,
  playerSetDuration,
  playerSetProgress,
} = playerSlice.actions

export default playerSlice
