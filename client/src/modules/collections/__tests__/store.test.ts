import type { PlaylistsStateType } from 'modules/collections/store'
import {
  playlistSlice,
  playlistSelectPlaylist,
  playlistSelectTrack,
  playlistsInitialState,
} from 'modules/collections/store'

vi.mock('modules/library/api', () => ({
  libraryAPI: {
    getLibrary: vi.fn().mockResolvedValue({}),
  },
}))

describe('playlists (redux)', () => {
  describe('reducer', () => {
    it('should handle initial state', () => {
      expect(playlistSlice.reducer(undefined, { type: '' })).toEqual(
        playlistsInitialState
      )
    })

    it('should handle playlistSelectPlaylist action', () => {
      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
      }

      expect(
        playlistSlice.reducer(testState, {
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
        playlistSlice.reducer(testState, {
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
