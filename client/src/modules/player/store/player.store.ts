import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setCycleNumPos, PlayerPlaybackMode } from 'modules/player/utils'

export type PlayerStateType = {
  // Controls and audio state.
  playing: boolean
  loading: boolean
  duration: number
  progress: number
  repeat: PlayerPlaybackMode
  shuffle: boolean
  volume: number
  volumeMuted: number
  // Track currently loaded in audio.
  track?: Track
}

export const playerInitialState: PlayerStateType = {
  playing: false,
  loading: false,
  duration: 0,
  progress: 0,
  repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
  shuffle: false,
  volume: 1,
  volumeMuted: 1,
  track: undefined,
}

const playerSlice = createSlice({
  name: 'player',
  initialState: playerInitialState,
  reducers: {
    playerTogglePlayPause(state, action: PayloadAction<boolean | undefined>) {
      if (state.track || action.payload !== undefined) {
        state.playing =
          action.payload === undefined ? !state.playing : action.payload
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
