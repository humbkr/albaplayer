import playlistsSlice, {
  playlistSelectPlaylist,
  playlistSelectTrack,
  playlistsInitialState,
  PlaylistsStateType,
} from 'modules/collections/store'

jest.mock('modules/library/api', () => ({
  libraryAPI: {
    getLibrary: jest.fn().mockResolvedValue({}),
  },
}))

describe('playlists (redux)', () => {
  describe('reducer', () => {
    it('should handle initial state', () => {
      // @ts-ignore
      expect(playlistsSlice(undefined, {})).toEqual(playlistsInitialState)
    })

    it('should handle playlistSelectPlaylist action', () => {
      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
      }

      expect(
        playlistsSlice(testState, {
          type: playlistSelectPlaylist.type,
          payload: 'playlist_id',
        })
      ).toEqual({
        ...testState,
        currentPlaylist: 'playlist_id',
      })
    })

    it('should handle playlistSelectTrack action', () => {
      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
        currentPlaylist: 'playlist_id',
      }

      expect(
        playlistsSlice(testState, {
          type: playlistSelectTrack.type,
          payload: { trackId: '1', trackIndex: 0 },
        })
      ).toEqual({
        ...testState,
        currentTrack: {
          id: '1',
          position: 0,
        },
      })
    })
  })
})
