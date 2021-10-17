import playerSlice, { playerInitialState } from '../player.redux'
import { libraryInitialState, LibraryStateType } from '../../library/redux'
import { PlayerPlaybackMode } from '../types'

const {
  playerTogglePlayPause,
  playerToggleShuffle,
  playerToggleRepeat,
  playerSetTrack,
  playerSetProgress,
  playerSetDuration,
  playerSetVolume,
} = playerSlice.actions

const mockLibraryState: LibraryStateType = {
  ...libraryInitialState,
  isInitialized: true,
  artists: {
    1: {
      id: '1',
      name: 'Various artists',
    },
    2: {
      id: '2',
      name: 'Zote the mighty',
    },
    3: {
      id: '3',
      name: 'Cornifer',
    },
  },
  albums: {
    1: {
      id: '1',
      title: 'Album 1',
      year: '1986',
      artistId: '2',
      dateAdded: 1614682652,
    },
    2: {
      id: '2',
      title: 'Album 2',
      year: '2002',
      artistId: '3',
      dateAdded: 1614682652,
    },
    3: {
      id: '3',
      title: 'Album 3',
      year: '1992',
      artistId: '2',
      dateAdded: 1614682652,
    },
    4: {
      id: '4',
      title: 'Compilation',
      year: '2018',
      artistId: '1',
      dateAdded: 1614682652,
    },
  },
  tracks: {
    1: {
      id: '1',
      title: 'Track 1',
      number: 1,
      disc: '',
      duration: 123,
      cover: '',
      albumId: '1',
      artistId: '2',
    },
    2: {
      id: '2',
      title: 'I draw a map',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '2',
      artistId: '3',
    },
    3: {
      id: '3',
      title: 'Track 3',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '1',
      artistId: '2',
    },
    4: {
      id: '4',
      title: 'Track 4',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '2',
    },
    5: {
      id: '5',
      title: 'Track 5',
      number: 1,
      disc: '',
      duration: 164,
      cover: '',
      albumId: '4',
      artistId: '1',
    },
  },
}

describe('player reducer', () => {
  it('should handle player initial state', () => {
    expect(playerSlice.reducer(undefined, { type: null })).toEqual(
      playerInitialState
    )
  })

  it('should handle playerTogglePlayPause action', () => {
    // No track in player, no forced value.
    expect(
      playerSlice.reducer(playerInitialState, {
        type: playerTogglePlayPause.type,
      })
    ).toEqual({
      ...playerInitialState,
      playing: false,
    })

    // Track in player, no forced value.
    expect(
      playerSlice.reducer(
        {
          ...playerInitialState,
          track: mockLibraryState.tracks['1'],
        },
        {
          type: playerTogglePlayPause.type,
        }
      )
    ).toEqual({
      ...playerInitialState,
      track: mockLibraryState.tracks['1'],
      playing: true,
    })

    // Track in player, no forced value, already playing.
    expect(
      playerSlice.reducer(
        {
          ...playerInitialState,
          track: mockLibraryState.tracks['1'],
          playing: true,
        },
        {
          type: playerTogglePlayPause.type,
        }
      )
    ).toEqual({
      ...playerInitialState,
      track: mockLibraryState.tracks['1'],
      playing: false,
    })

    // No track in player, forced value true.
    expect(
      playerSlice.reducer(playerInitialState, {
        type: playerTogglePlayPause.type,
        payload: true,
      })
    ).toEqual({
      ...playerInitialState,
      playing: true,
    })

    // No track in player, forced value false.
    expect(
      playerSlice.reducer(
        {
          ...playerInitialState,
          playing: true,
        },
        {
          type: playerTogglePlayPause.type,
          payload: false,
        }
      )
    ).toEqual({
      ...playerInitialState,
      playing: false,
    })
  })

  it('should handle playerToggleShuffle action', () => {
    expect(
      playerSlice.reducer(playerInitialState, {
        type: playerToggleShuffle.type,
      })
    ).toEqual({
      ...playerInitialState,
      shuffle: true,
    })

    expect(
      playerSlice.reducer(
        {
          ...playerInitialState,
          shuffle: true,
        },
        {
          type: playerToggleShuffle.type,
        }
      )
    ).toEqual({
      ...playerInitialState,
      shuffle: false,
    })
  })

  it('should handle playerToggleRepeat action', () => {
    expect(
      playerSlice.reducer(playerInitialState, {
        type: playerToggleRepeat.type,
      })
    ).toEqual({
      ...playerInitialState,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL,
    })

    expect(
      playerSlice.reducer(
        {
          ...playerInitialState,
          repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL,
        },
        {
          type: playerToggleRepeat.type,
        }
      )
    ).toEqual({
      ...playerInitialState,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE,
    })

    expect(
      playerSlice.reducer(
        {
          ...playerInitialState,
          repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE,
        },
        {
          type: playerToggleRepeat.type,
        }
      )
    ).toEqual({
      ...playerInitialState,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
    })
  })

  it('should handle playerSetVolume action', () => {
    expect(
      playerSlice.reducer(playerInitialState, {
        type: playerSetVolume.type,
        payload: 42,
      })
    ).toEqual({
      ...playerInitialState,
      volume: 42,
    })
  })

  it('should handle playerSetTrack action', () => {
    expect(
      playerSlice.reducer(playerInitialState, {
        type: playerSetTrack.type,
        payload: mockLibraryState.tracks[0],
      })
    ).toEqual({
      ...playerInitialState,
      track: mockLibraryState.tracks[0],
    })
  })

  it('should handle playerSetDuration action', () => {
    expect(
      playerSlice.reducer(playerInitialState, {
        type: playerSetDuration.type,
        payload: 134,
      })
    ).toEqual({
      ...playerInitialState,
      duration: 134,
    })
  })

  it('should handle playerSetProgress action', () => {
    expect(
      playerSlice.reducer(playerInitialState, {
        type: playerSetProgress.type,
        payload: 120,
      })
    ).toEqual({
      ...playerInitialState,
      progress: 120,
    })
  })
})
