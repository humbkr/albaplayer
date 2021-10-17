import configureMockStore from 'redux-mock-store'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import playlistsSlice, {
  playlistsInitialState,
  playlistSelectPlaylist,
  playlistCreatePlaylist,
  playlistDeletePlaylist,
  PlaylistsStateType,
  playlistSelectTrack,
  playlistRemoveTrack,
  playlistAddTracks,
  playlistUpdateItems,
  playlistUpdateInfo,
  addTrack,
  addAlbum,
  addArtist,
  addPlaylist,
  playlistsSelector,
} from '../redux'
// eslint-disable-next-line import/no-extraneous-dependencies
import { libraryInitialState, LibraryStateType } from '../../library/redux'

jest.mock('api')
const mockStore = configureMockStore([thunk])
const makeMockStore = (customState: any = {}) => mockStore({
  library: libraryInitialState,
  playlist: playlistsInitialState,
  ...customState,
})

const mockLibraryState: LibraryStateType = {
  ...libraryInitialState,
  isInitialized: true,
  artists: {
    1: {
      id: '1',
      name: 'Artist 1',
      dateAdded: 1234323433,
    },
    2: {
      id: '2',
      name: 'Artist 2',
      dateAdded: 1234323433,
    },
  },
  albums: {
    1: {
      id: '1',
      title: 'Album 1',
      year: '1986',
      artistId: '1',
      dateAdded: 1234323433,
    },
    2: {
      id: '2',
      title: 'Album 2',
      year: '2002',
      artistId: '2',
      dateAdded: 1234323433,
    },
    3: {
      id: '3',
      title: 'Album 3',
      year: '1992',
      artistId: '1',
      dateAdded: 1234323433,
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
      artistId: '1',
      dateAdded: 1234323433,
    },
    2: {
      id: '2',
      title: 'Track 2',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '2',
      artistId: '2',
      dateAdded: 1234323433,
    },
    3: {
      id: '3',
      title: 'Track 3',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '1',
      artistId: '1',
      dateAdded: 1234323433,
    },
    4: {
      id: '4',
      title: 'Track 4',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '1',
      dateAdded: 1234323433,
    },
  },
}

const mockPlaylistsState: PlaylistsStateType = {
  ...playlistsInitialState,
  playlists: {
    temp_001: {
      id: 'temp_001',
      title: 'My playlist',
      date: '2020-04-12',
      items: [],
    },
    temp_002: {
      id: 'temp_002',
      title: 'My other playlist',
      date: '2020-04-13',
      items: [
        {
          track: {
            ...mockLibraryState.tracks['1'],
            album: mockLibraryState.albums['1'],
            artist: mockLibraryState.artists['1'],
          },
          position: 1,
        },
        {
          track: {
            ...mockLibraryState.tracks['2'],
            album: mockLibraryState.albums['2'],
            artist: mockLibraryState.artists['2'],
          },
          position: 2,
        },
        {
          track: {
            ...mockLibraryState.tracks['4'],
            album: mockLibraryState.albums['3'],
            artist: mockLibraryState.artists['1'],
          },
          position: 3,
        },
      ],
    },
  },
}

describe('playlists (redux)', () => {
  describe('reducer', () => {
    it('should handle initial state', () => {
      // @ts-ignore
      expect(playlistsSlice(undefined, {})).toEqual(playlistsInitialState)
    })

    it('should handle playlistSelectPlaylist action', () => {
      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_001: {
            id: 'temp_001',
            title: 'My playlist',
            date: '2020-04-12',
            items: [],
          },
        },
      }

      expect(
        playlistsSlice(testState, {
          type: playlistSelectPlaylist.type,
          payload: {
            selectedPlaylist: testState.playlists.temp_001,
            playlistIndex: 0,
          },
        })
      ).toEqual({
        ...testState,
        currentPlaylist: {
          playlist: testState.playlists.temp_001,
          position: 0,
        },
      })
    })

    it('should handle playlistCreatePlaylist action', () => {
      const newPlaylist: Playlist = {
        id: 'temp_1234',
        title: 'My playlist',
        date: '2020-04-12',
        items: [],
      }

      expect(
        playlistsSlice(playlistsInitialState, {
          type: playlistCreatePlaylist.type,
          payload: newPlaylist,
        })
      ).toEqual({
        ...playlistsInitialState,
        playlists: {
          temp_1234: newPlaylist,
        },
        currentPlaylist: {
          playlist: newPlaylist,
          position: 0,
        },
      })
    })

    it('should handle playlistDeletePlaylist action', () => {
      const playlist1: Playlist = {
        id: 'temp_001',
        title: 'My playlist',
        date: '2020-04-12',
        items: [],
      }

      const playlist2: Playlist = {
        id: 'temp_002',
        title: 'My second playlist',
        date: '2020-04-12',
        items: [],
      }

      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_001: playlist1,
          temp_002: playlist2,
        },
        currentPlaylist: {
          playlist: playlist1,
          position: 0,
        },
      }

      // Delete first (current) playlist.
      expect(
        playlistsSlice(testState, {
          type: playlistDeletePlaylist.type,
          payload: playlist1,
        })
      ).toEqual({
        ...playlistsInitialState,
        playlists: {
          temp_002: playlist2,
        },
        currentPlaylist: {
          playlist: playlist2,
          position: 0,
        },
      })

      // Delete the only playlist left in the list.
      const testState2: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_002: playlist2,
        },
        currentPlaylist: {
          playlist: playlist2,
          position: 0,
        },
      }

      expect(
        playlistsSlice(testState2, {
          type: playlistDeletePlaylist.type,
          payload: playlist2,
        })
      ).toEqual({
        ...playlistsInitialState,
        playlists: {},
        currentPlaylist: {
          playlist: null,
          position: 0,
        },
      })
    })

    it('should handle playlistSelectTrack action', () => {
      const playlist1: Playlist = {
        id: 'temp_001',
        title: 'My playlist',
        date: '2020-04-12',
        items: [
          {
            track: {
              id: '1',
              title: 'Track 1',
              number: 1,
              disc: '',
              duration: 123,
              cover: '',
            },
            position: 1,
          },
        ],
      }

      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_001: playlist1,
        },
        currentPlaylist: {
          playlist: playlist1,
          position: 0,
        },
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

    it('should handle playlistRemoveTrack action', () => {
      const playlist1: Playlist = {
        id: 'temp_001',
        title: 'My playlist',
        date: '2020-04-12',
        items: [
          {
            track: {
              id: '1',
              title: 'Track 1',
              number: 1,
              disc: '',
              duration: 123,
              cover: '',
            },
            position: 1,
          },
          {
            track: {
              id: '2',
              title: 'Track 2',
              number: 2,
              disc: '',
              duration: 124,
              cover: '',
            },
            position: 2,
          },
        ],
      }

      const playlist1WithoutFirstTracks: Playlist = {
        id: 'temp_001',
        title: 'My playlist',
        date: '2020-04-12',
        items: [
          {
            track: {
              id: '2',
              title: 'Track 2',
              number: 2,
              disc: '',
              duration: 124,
              cover: '',
            },
            position: 1,
          },
        ],
      }

      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_001: playlist1,
        },
        currentPlaylist: {
          playlist: playlist1,
          position: 0,
        },
        currentTrack: {
          id: '1',
          position: 0,
        },
      }

      expect(
        playlistsSlice(testState, {
          type: playlistRemoveTrack.type,
          payload: { playlistId: 'temp_001', trackPosition: 1 },
        })
      ).toEqual({
        ...testState,
        playlists: {
          temp_001: playlist1WithoutFirstTracks,
        },
        currentPlaylist: {
          playlist: playlist1WithoutFirstTracks,
          position: 0,
        },
      })
    })

    it('should handle playlistAddTracks action', () => {
      const playlist1: Playlist = {
        id: 'temp_001',
        title: 'My playlist',
        date: '2020-04-12',
        items: [],
      }

      const tracksToAdd: Track[] = [
        {
          id: '1',
          title: 'Track 1',
          number: 1,
          disc: '',
          duration: 123,
          cover: '',
        },
        {
          id: '2',
          title: 'Track 2',
          number: 2,
          disc: '',
          duration: 124,
          cover: '',
        },
      ]

      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_001: playlist1,
        },
        currentPlaylist: {
          playlist: playlist1,
          position: 0,
        },
      }

      expect(
        playlistsSlice(testState, {
          type: playlistAddTracks.type,
          payload: { playlistId: 'temp_001', tracks: tracksToAdd },
        })
      ).toEqual({
        ...testState,
        playlists: {
          temp_001: {
            ...playlist1,
            items: [
              {
                track: tracksToAdd[0],
                position: 1,
              },
              {
                track: tracksToAdd[1],
                position: 2,
              },
            ],
          },
        },
        currentPlaylist: {
          playlist: {
            ...playlist1,
            items: [
              {
                track: tracksToAdd[0],
                position: 1,
              },
              {
                track: tracksToAdd[1],
                position: 2,
              },
            ],
          },
          position: 0,
        },
      })
    })

    it('should handle playlistUpdateItems action', () => {
      const playlist1: Playlist = {
        id: 'temp_001',
        title: 'My playlist',
        date: '2020-04-12',
        items: [
          {
            track: {
              id: '1',
              title: 'Track 1',
              number: 1,
              disc: '',
              duration: 123,
              cover: '',
            },
            position: 1,
          },
          {
            track: {
              id: '2',
              title: 'Track 2',
              number: 2,
              disc: '',
              duration: 124,
              cover: '',
            },
            position: 2,
          },
        ],
      }

      const newItems: PlaylistItem[] = [
        {
          track: {
            id: '3',
            title: 'Track 3',
            number: 3,
            disc: '',
            duration: 123,
            cover: '',
          },
          position: 7,
        },
        {
          track: {
            id: '4',
            title: 'Track 4',
            number: 4,
            disc: '',
            duration: 124,
            cover: '',
          },
          position: 9,
        },
      ]

      const playlist1WithNewItems: Playlist = {
        id: 'temp_001',
        title: 'My playlist',
        date: '2020-04-12',
        items: [
          {
            track: {
              id: '3',
              title: 'Track 3',
              number: 3,
              disc: '',
              duration: 123,
              cover: '',
            },
            position: 1,
          },
          {
            track: {
              id: '4',
              title: 'Track 4',
              number: 4,
              disc: '',
              duration: 124,
              cover: '',
            },
            position: 2,
          },
        ],
      }

      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_001: playlist1,
        },
        currentPlaylist: {
          playlist: playlist1,
          position: 0,
        },
      }

      expect(
        playlistsSlice(testState, {
          type: playlistUpdateItems.type,
          payload: { playlistId: 'temp_001', newItems },
        })
      ).toEqual({
        ...testState,
        playlists: {
          temp_001: playlist1WithNewItems,
        },
        currentPlaylist: {
          playlist: playlist1WithNewItems,
          position: 0,
        },
      })
    })

    it('should handle playlistUpdateInfo action', () => {
      const playlist: Playlist = {
        id: 'temp_001',
        title: 'My playlist',
        date: '2020-04-12',
        items: [
          {
            track: {
              id: '1',
              title: 'Track 1',
              number: 1,
              disc: '',
              duration: 123,
              cover: '',
            },
            position: 1,
          },
        ],
      }

      const playlistUpdated: Playlist = {
        id: 'temp_001',
        title: 'My playlist updated',
        date: '2020-04-13',
        items: [
          {
            track: {
              id: '1',
              title: 'Track 1',
              number: 1,
              disc: '',
              duration: 123,
              cover: '',
            },
            position: 1,
          },
        ],
      }

      const testState: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_001: playlist,
        },
        currentPlaylist: {
          playlist,
          position: 0,
        },
      }

      expect(
        playlistsSlice(testState, {
          type: playlistUpdateInfo.type,
          payload: playlistUpdated,
        })
      ).toEqual({
        ...testState,
        playlists: {
          temp_001: playlistUpdated,
        },
        currentPlaylist: {
          playlist: playlistUpdated,
          position: 0,
        },
      })

      // Test playlist is not the current one branch.
      const playlist2: Playlist = {
        id: 'temp_002',
        title: 'My playlist 2',
        date: '2020-04-12',
        items: [],
      }

      const testState2: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          temp_001: playlist,
          temp_002: playlist2,
        },
        currentPlaylist: {
          playlist: playlist2,
          position: 0,
        },
      }

      expect(
        playlistsSlice(testState2, {
          type: playlistUpdateInfo.type,
          payload: playlistUpdated,
        })
      ).toEqual({
        ...testState2,
        playlists: {
          temp_001: playlistUpdated,
          temp_002: playlist2,
        },
      })
    })
  })

  describe('addTrack thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        playlist: mockPlaylistsState,
      })

      const expectedTrackList: Track[] = [
        {
          ...mockLibraryState.tracks['1'],
          album: mockLibraryState.albums['1'],
          artist: mockLibraryState.artists['1'],
        },
      ]

      const expected = [
        playlistAddTracks({
          playlistId: 'temp_001',
          tracks: expectedTrackList,
        }),
      ]

      // @ts-ignore
      store.dispatch(addTrack({ playlistId: 'temp_001', trackId: '1' }))
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('addAlbum thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        playlist: mockPlaylistsState,
      })

      const expectedTrackList: Track[] = [
        {
          ...mockLibraryState.tracks['1'],
          album: mockLibraryState.albums['1'],
          artist: mockLibraryState.artists['1'],
        },
        {
          ...mockLibraryState.tracks['3'],
          album: mockLibraryState.albums['1'],
          artist: mockLibraryState.artists['1'],
        },
      ]

      const expected = [
        playlistAddTracks({
          playlistId: 'temp_001',
          tracks: expectedTrackList,
        }),
      ]

      // @ts-ignore
      store.dispatch(addAlbum({ playlistId: 'temp_001', albumId: '1' }))
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('addArtist thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        playlist: mockPlaylistsState,
      })

      const expectedTrackList: Track[] = [
        {
          ...mockLibraryState.tracks['1'],
          album: mockLibraryState.albums['1'],
          artist: mockLibraryState.artists['1'],
        },
        {
          ...mockLibraryState.tracks['3'],
          album: mockLibraryState.albums['1'],
          artist: mockLibraryState.artists['1'],
        },
        {
          ...mockLibraryState.tracks['4'],
          album: mockLibraryState.albums['3'],
          artist: mockLibraryState.artists['1'],
        },
      ]

      const expected = [
        playlistAddTracks({
          playlistId: 'temp_001',
          tracks: expectedTrackList,
        }),
      ]

      // @ts-ignore
      store.dispatch(addArtist({ playlistId: 'temp_001', artistId: '1' }))
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('addPlaylist thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        playlist: mockPlaylistsState,
      })

      const expectedTrackList: Track[] = [
        {
          ...mockLibraryState.tracks['1'],
          album: mockLibraryState.albums['1'],
          artist: mockLibraryState.artists['1'],
        },
        {
          ...mockLibraryState.tracks['2'],
          album: mockLibraryState.albums['2'],
          artist: mockLibraryState.artists['2'],
        },
        {
          ...mockLibraryState.tracks['4'],
          album: mockLibraryState.albums['3'],
          artist: mockLibraryState.artists['1'],
        },
      ]

      const expected = [
        playlistAddTracks({
          playlistId: 'temp_001',
          tracks: expectedTrackList,
        }),
      ]

      store.dispatch(
        // @ts-ignore
        addPlaylist({ playlistId: 'temp_001', playlistToAddId: 'temp_002' })
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('playlistsSelector selector', () => {
    it('should return playlists ordered by title', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        playlist: mockPlaylistsState,
      })

      const orderedPlaylists = playlistsSelector(store.getState())
      expect(orderedPlaylists).toBeArray()
      expect(orderedPlaylists[0].title).toBe('My other playlist')
      expect(orderedPlaylists[1].title).toBe('My playlist')
    })
  })
})
