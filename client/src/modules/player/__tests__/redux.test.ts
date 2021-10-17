import { libraryInitialState, LibraryStateType } from 'modules/library/redux'
import configureMockStore from 'redux-mock-store'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import { api } from 'api'
import {
  setItemFromQueue,
  playTrack,
  playAlbum,
  playArtist,
  playPlaylist,
  addTrack,
  addAlbum,
  addArtist,
  addPlaylist,
  setNextTrack,
  setPreviousTrack,
  getTracksFromArtist,
  getTracksFromPlaylist,
  getTracksFromAlbum,
  playerSetTrack,
  playerTogglePlayPause,
  playerSetProgress,
  queueSetCurrent,
  queueClear,
  queueAddTracks,
  queueAddTracksAfterCurrent,
  playTrackAfterCurrent,
  playAlbumAfterCurrent,
  playArtistAfterCurrent,
  playPlaylistAfterCurrent,
} from '../redux'
import { playlistsInitialState, PlaylistsStateType } from '../../playlist/redux'

import { PlayerPlaybackMode } from '../types'
import { setCycleNumPos } from '../utils'
import { playerInitialState } from '../player.redux'
import { queueInitialState } from '../queue.redux'

jest.mock('api')

const mockStore = configureMockStore([thunk])
const makeMockStore = (customState: any = {}) => mockStore({
  player: playerInitialState,
  queue: queueInitialState,
  ...customState,
})

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

const mockPlaylistsState: PlaylistsStateType = {
  ...playlistsInitialState,
  playlists: {
    temp_001: {
      id: 'temp_001',
      title: 'My playlist',
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

describe('player (redux)', () => {
  describe('setItemFromQueue thunk', () => {
    it('should handle trying to set a track at position 0 of an empty queue', () => {
      const store = makeMockStore()
      api.getFullTrackInfo = jest.fn()

      // @ts-ignore
      expect(store.dispatch(setItemFromQueue(0))).toBeNull()
      expect(api.getFullTrackInfo).not.toHaveBeenCalled()
    })

    it('should handle trying to set a track at position 2 of a queue containing less than 3 items', () => {
      const store = makeMockStore({
        queue: {
          ...queueInitialState,
          items: [
            {
              track: {
                id: '1',
                title: 'Track 01',
                number: 1,
                disc: '',
                duration: 143,
                cover: '',
              },
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
            },
          ],
        },
      })

      api.getFullTrackInfo = jest.fn()

      // @ts-ignore
      expect(store.dispatch(setItemFromQueue(2))).toBeNull()
      expect(api.getFullTrackInfo).not.toHaveBeenCalled()
    })

    it('should handle setting a track', () => {
      const store = makeMockStore({
        queue: {
          ...queueInitialState,
          items: [
            {
              track: {
                id: '1',
                title: 'Track 01',
                number: 1,
                disc: '',
                duration: 143,
                cover: '',
              },
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
            },
          ],
        },
      })

      const response = {
        data: {
          track: {
            id: '1',
            title: 'Track 01',
            number: 1,
            disc: '',
            duration: 143,
            src: '/what/ever/path.mp3',
            cover: '',
            album: {
              id: '1',
              title: 'Album 01',
              year: '2000',
              dateAdded: 1614682652,
            },
            artist: {
              id: '1',
              name: 'Artist 01',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(0)]

      // @ts-ignore
      store.dispatch(setItemFromQueue(0)).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should handle setting a track with a cover', () => {
      const store = makeMockStore({
        queue: {
          ...queueInitialState,
          items: [
            {
              track: {
                id: '1',
                title: 'Track 01',
                number: 1,
                disc: '',
                duration: 143,
                cover: '',
              },
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
            },
          ],
        },
      })

      const response = {
        data: {
          track: {
            id: '1',
            title: 'Track 01',
            number: 1,
            disc: '',
            duration: 143,
            src: '/what/ever/path.mp3',
            cover: '43059405324',
            album: {
              id: '1',
              title: 'Album 01',
              year: '2000',
              dateAdded: 1614682652,
            },
            artist: {
              id: '1',
              name: 'Artist 01',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(0)]

      // @ts-ignore
      store.dispatch(setItemFromQueue(0)).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('playTrack thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const expectedTrack = {
        ...mockLibraryState.tracks['1'],
        artist: mockLibraryState.tracks['1'].artistId
          ? mockLibraryState.artists[mockLibraryState.tracks['1'].artistId]
          : undefined,
        album: mockLibraryState.tracks['1'].albumId
          ? mockLibraryState.albums[mockLibraryState.tracks['1'].albumId]
          : undefined,
      }

      const expected = [
        queueClear(),
        queueAddTracks([expectedTrack]),
        // SetItemFromQueue(0),
        playerTogglePlayPause(true),
      ]

      store.dispatch(
        // @ts-ignore
        playTrack('1')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('playAlbum thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const albumTracks = Object.values(mockLibraryState.tracks).filter(
        (item) => item.albumId === '1'
      )
      const expectedTracks = albumTracks.map((item) => ({
        ...item,
        artist: item.artistId
          ? mockLibraryState.artists[item.artistId]
          : undefined,
        album: item.albumId ? mockLibraryState.albums[item.albumId] : undefined,
      }))

      const expected = [
        queueClear(),
        queueAddTracks(expectedTracks),
        // SetItemFromQueue(0),
        playerTogglePlayPause(true),
      ]

      store.dispatch(
        // @ts-ignore
        playAlbum('1')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('playArtist thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const artistTracks = Object.values(mockLibraryState.tracks).filter(
        (item) => item.artistId === '2'
      )
      const expectedTracks = artistTracks.map((item) => ({
        ...item,
        artist: item.artistId
          ? mockLibraryState.artists[item.artistId]
          : undefined,
        album: item.albumId ? mockLibraryState.albums[item.albumId] : undefined,
      }))

      const expected = [
        queueClear(),
        queueAddTracks(expectedTracks),
        // SetItemFromQueue(0),
        playerTogglePlayPause(true),
      ]

      store.dispatch(
        // @ts-ignore
        playArtist('2')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('playPlaylist thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        playlist: mockPlaylistsState,
      })

      api.getFullTrackInfo = jest.fn()

      const expectedTracks = mockPlaylistsState.playlists.temp_001.items.map(
        (item) => ({
          ...item.track,
          artist: item.track.artistId
            ? mockLibraryState.artists[item.track.artistId]
            : undefined,
          album: item.track.albumId
            ? mockLibraryState.albums[item.track.albumId]
            : undefined,
        })
      )

      const expected = [
        queueClear(),
        queueAddTracks(expectedTracks),
        // SetItemFromQueue(0),
        playerTogglePlayPause(true),
      ]

      store.dispatch(
        // @ts-ignore
        playPlaylist('temp_001')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('playTrackAfterCurrent thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const expectedTrack = {
        ...mockLibraryState.tracks['1'],
        artist: mockLibraryState.tracks['1'].artistId
          ? mockLibraryState.artists[mockLibraryState.tracks['1'].artistId]
          : undefined,
        album: mockLibraryState.tracks['1'].albumId
          ? mockLibraryState.albums[mockLibraryState.tracks['1'].albumId]
          : undefined,
      }

      const expected = [
        queueAddTracksAfterCurrent([expectedTrack]),
        // SetItemFromQueue(0),
      ]

      store.dispatch(
        // @ts-ignore
        playTrackAfterCurrent('1')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('playAlbumAfterCurrent thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const albumTracks = Object.values(mockLibraryState.tracks).filter(
        (item) => item.albumId === '1'
      )
      const expectedTracks = albumTracks.map((item) => ({
        ...item,
        artist: item.artistId
          ? mockLibraryState.artists[item.artistId]
          : undefined,
        album: item.albumId ? mockLibraryState.albums[item.albumId] : undefined,
      }))

      const expected = [
        queueAddTracksAfterCurrent(expectedTracks),
        // SetItemFromQueue(0),
      ]

      store.dispatch(
        // @ts-ignore
        playAlbumAfterCurrent('1')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('playArtistAfterCurrent thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const artistTracks = Object.values(mockLibraryState.tracks).filter(
        (item) => item.artistId === '2'
      )
      const expectedTracks = artistTracks.map((item) => ({
        ...item,
        artist: item.artistId
          ? mockLibraryState.artists[item.artistId]
          : undefined,
        album: item.albumId ? mockLibraryState.albums[item.albumId] : undefined,
      }))

      const expected = [
        queueAddTracksAfterCurrent(expectedTracks),
        // SetItemFromQueue(0),
      ]

      store.dispatch(
        // @ts-ignore
        playArtistAfterCurrent('2')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('playPlaylistAfterCurrent thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        playlist: mockPlaylistsState,
      })

      api.getFullTrackInfo = jest.fn()

      const expectedTracks = mockPlaylistsState.playlists.temp_001.items.map(
        (item) => ({
          ...item.track,
          artist: item.track.artistId
            ? mockLibraryState.artists[item.track.artistId]
            : undefined,
          album: item.track.albumId
            ? mockLibraryState.albums[item.track.albumId]
            : undefined,
        })
      )

      const expected = [
        queueAddTracksAfterCurrent(expectedTracks),
        // SetItemFromQueue(0),
      ]

      store.dispatch(
        // @ts-ignore
        playPlaylistAfterCurrent('temp_001')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('addTrack thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const expectedTrack = {
        ...mockLibraryState.tracks['1'],
        artist: mockLibraryState.tracks['1'].artistId
          ? mockLibraryState.artists[mockLibraryState.tracks['1'].artistId]
          : undefined,
        album: mockLibraryState.tracks['1'].albumId
          ? mockLibraryState.albums[mockLibraryState.tracks['1'].albumId]
          : undefined,
      }

      const expected = [
        queueAddTracks([expectedTrack]),
        // SetItemFromQueue(0),
      ]

      store.dispatch(
        // @ts-ignore
        addTrack('1')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('addAlbum thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const albumTracks = Object.values(mockLibraryState.tracks).filter(
        (item) => item.albumId === '1'
      )
      const expectedTracks = albumTracks.map((item) => ({
        ...item,
        artist: item.artistId
          ? mockLibraryState.artists[item.artistId]
          : undefined,
        album: item.albumId ? mockLibraryState.albums[item.albumId] : undefined,
      }))

      const expected = [
        queueAddTracks(expectedTracks),
        // SetItemFromQueue(0),
      ]

      store.dispatch(
        // @ts-ignore
        addAlbum('1')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('addArtist thunk', () => {
    it('should dispatch correct actions', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      const artistTracks = Object.values(mockLibraryState.tracks).filter(
        (item) => item.artistId === '2'
      )
      const expectedTracks = artistTracks.map((item) => ({
        ...item,
        artist: item.artistId
          ? mockLibraryState.artists[item.artistId]
          : undefined,
        album: item.albumId ? mockLibraryState.albums[item.albumId] : undefined,
      }))

      const expected = [
        queueAddTracks(expectedTracks),
        // SetItemFromQueue(0),
      ]

      store.dispatch(
        // @ts-ignore
        addArtist('2')
      )
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

      api.getFullTrackInfo = jest.fn()

      const expectedTracks = mockPlaylistsState.playlists.temp_001.items.map(
        (item) => ({
          ...item.track,
          artist: item.track.artistId
            ? mockLibraryState.artists[item.track.artistId]
            : undefined,
          album: item.track.albumId
            ? mockLibraryState.albums[item.track.albumId]
            : undefined,
        })
      )

      const expected = [
        queueAddTracks(expectedTracks),
        // SetItemFromQueue(0),
      ]

      store.dispatch(
        // @ts-ignore
        addPlaylist('temp_001')
      )
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('setNextTrack thunk', () => {
    it('should dispatch correct actions when there is no track in player', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
        },
      })

      const response = {
        data: {
          track: {
            id: '1',
            title: 'Track 01',
            number: 1,
            disc: '',
            duration: 143,
            src: '/what/ever/path.mp3',
            cover: '',
            album: {
              id: '1',
              title: 'Album 01',
              year: '2000',
              dateAdded: 1614682652,
            },
            artist: {
              id: '1',
              name: 'Artist 01',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(0)]

      store
        .dispatch(
          // @ts-ignore
          setNextTrack(false)
        )
        .then(() => {
          const actual = store.getActions()
          expect(actual).toEqual(expected)
        })
    })

    it('should dispatch correct actions when there is no track in player and queue is empty', () => {
      const store = makeMockStore({
        library: mockLibraryState,
      })

      api.getFullTrackInfo = jest.fn()

      // @ts-ignore
      expect(store.dispatch(setNextTrack(false))).toBeNull()
      expect(api.getFullTrackInfo).not.toHaveBeenCalled()
    })

    it('should dispatch correct actions when repeat one is enabled', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE,
          track: mockLibraryState.tracks['2'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 1,
        },
      })

      const response = {
        data: {
          track: {
            id: '2',
            title: 'I draw a map',
            number: 2,
            disc: '',
            duration: 124,
            src: '/what/ever/path.mp3',
            cover: '32432423',
            album: {
              id: '2',
              title: 'Album 02',
              year: '2002',
              dateAdded: 1614682652,
            },
            artist: {
              id: '3',
              name: 'Cornifer',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(1)]

      store
        .dispatch(
          // @ts-ignore
          setNextTrack(false)
        )
        .then(() => {
          const actual = store.getActions()
          expect(actual).toEqual(expected)
        })
    })

    // TODO impossible to correctly test a random event so for the moment we test it doesn't crash.
    it('should dispatch correct actions when shuffle is enabled', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          shuffle: true,
          track: mockLibraryState.tracks['2'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 1,
        },
      })

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise<void>((resolve) => {
          resolve()
        })
      )

      // @ts-ignore
      expect(store.dispatch(setNextTrack(false))).not.toBeNull()
    })

    it('should dispatch correct actions when there is a next track in the queue', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          track: mockLibraryState.tracks['1'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 0,
        },
      })

      const response = {
        data: {
          track: {
            id: '2',
            title: 'I draw a map',
            number: 2,
            disc: '',
            duration: 124,
            src: '/what/ever/path.mp3',
            cover: '32432423',
            album: {
              id: '2',
              title: 'Album 02',
              year: '2002',
              dateAdded: 1614682652,
            },
            artist: {
              id: '3',
              name: 'Cornifer',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(1)]

      // @ts-ignore
      store.dispatch(setNextTrack(false)).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should dispatch correct actions when there is no next track in queue and repeat all is enabled', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL,
          track: mockLibraryState.tracks['2'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 1,
        },
      })

      const response = {
        data: {
          track: {
            id: '1',
            title: 'Track 01',
            number: 1,
            disc: '',
            duration: 143,
            src: '/what/ever/path.mp3',
            cover: '',
            album: {
              id: '1',
              title: 'Album 01',
              year: '2000',
              dateAdded: 1614682652,
            },
            artist: {
              id: '1',
              name: 'Artist 01',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(0)]

      // @ts-ignore
      store.dispatch(setNextTrack(false)).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should dispatch correct actions when there is no next track in queue', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          track: mockLibraryState.tracks['2'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 1,
        },
      })

      // @ts-ignore
      expect(store.dispatch(setNextTrack(false))).toBeNull()
    })

    it('should dispatch correct actions when there is no next track in queue and previous track has finished naturally', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          track: mockLibraryState.tracks['2'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 1,
        },
      })

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise<void>((resolve) => {
          resolve()
        })
      )

      const expected = [playerSetProgress(0), playerTogglePlayPause(false)]

      // @ts-ignore
      store.dispatch(setNextTrack(true))
      const actual = store.getActions()
      expect(actual).toEqual(expected)
    })
  })

  describe('setPreviousTrack thunk', () => {
    it('should dispatch correct actions when there is no track in player', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
        },
      })

      // @ts-ignore
      expect(store.dispatch(setPreviousTrack())).toBeNull()
    })

    it('should dispatch correct actions when repeat one is enabled', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE,
          track: mockLibraryState.tracks['2'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 1,
        },
      })

      const response = {
        data: {
          track: {
            id: '2',
            title: 'I draw a map',
            number: 2,
            disc: '',
            duration: 124,
            src: '/what/ever/path.mp3',
            cover: '32432423',
            album: {
              id: '2',
              title: 'Album 02',
              year: '2002',
              dateAdded: 1614682652,
            },
            artist: {
              id: '3',
              name: 'Cornifer',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(1)]

      store
        .dispatch(
          // @ts-ignore
          setPreviousTrack()
        )
        .then(() => {
          const actual = store.getActions()
          expect(actual).toEqual(expected)
        })
    })

    // TODO impossible to correctly test a random event so for the moment we test it doesn't crash.
    it('should dispatch correct actions when shuffle is enabled', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          shuffle: true,
          track: mockLibraryState.tracks['2'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 1,
        },
      })

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise<void>((resolve) => {
          resolve()
        })
      )

      // @ts-ignore
      expect(store.dispatch(setPreviousTrack())).not.toBeNull()
    })

    it('should dispatch correct actions when there is a previous track in the queue', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          track: mockLibraryState.tracks['2'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 1,
        },
      })

      const response = {
        data: {
          track: {
            id: '1',
            title: 'Track 01',
            number: 1,
            disc: '',
            duration: 143,
            src: '/what/ever/path.mp3',
            cover: '',
            album: {
              id: '1',
              title: 'Album 01',
              year: '2000',
              dateAdded: 1614682652,
            },
            artist: {
              id: '1',
              name: 'Artist 01',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(0)]

      // @ts-ignore
      store.dispatch(setPreviousTrack()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should dispatch correct actions when there is no previous track in queue and repeat all is enabled', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL,
          track: mockLibraryState.tracks['1'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 0,
        },
      })

      const response = {
        data: {
          track: {
            id: '2',
            title: 'I draw a map',
            number: 2,
            disc: '',
            duration: 124,
            src: '/what/ever/path.mp3',
            cover: '32432423',
            album: {
              id: '2',
              title: 'Album 02',
              year: '2002',
              dateAdded: 1614682652,
            },
            artist: {
              id: '3',
              name: 'Cornifer',
            },
          },
        },
      }

      api.getFullTrackInfo = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [playerSetTrack(response.data.track), queueSetCurrent(1)]

      // @ts-ignore
      store.dispatch(setPreviousTrack()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should dispatch correct actions when there is no previous track in queue', () => {
      const store = makeMockStore({
        library: mockLibraryState,
        player: {
          ...playerInitialState,
          playing: true,
          track: mockLibraryState.tracks['1'],
        },
        queue: {
          ...queueInitialState,
          items: [
            { track: mockLibraryState.tracks['1'] },
            { track: mockLibraryState.tracks['2'] },
          ],
          current: 0,
        },
      })

      // @ts-ignore
      expect(store.dispatch(setPreviousTrack())).toBeNull()
    })
  })

  describe('setCycleNumPos utility function', () => {
    it('should return the next integer of the list', () => {
      const test = setCycleNumPos(3, 1, 5)
      expect(test).toBe(4)
    })

    it('should cycle when reaching the end of the list', () => {
      const test = setCycleNumPos(3, 4, 5)
      expect(test).toBe(2)
    })

    it('should cycle when reaching the beginning of the list (reverse cycle)', () => {
      const test = setCycleNumPos(3, -4, 5)
      expect(test).toBe(4)
    })
  })

  describe('getTracksFromArtist', () => {
    it('should return an artist tracks, hydrated', () => {
      const tracks: Track[] = getTracksFromArtist('2', mockLibraryState)

      expect(tracks).toBeArray()
      expect(tracks.length).toBe(3)

      const retrievedTracksIds = tracks.map((item) => item.id)
      const expectedTracksIds = Object.values<Track>(mockLibraryState.tracks)
        .filter((item) => item.artistId === '2')
        .map((item) => item.id)

      expect(retrievedTracksIds).toStrictEqual(expectedTracksIds)

      tracks.forEach((track) => {
        if (track.artistId) {
          expect(track.artist).toBe(mockLibraryState.artists[track.artistId])
        }
        if (track.albumId) {
          expect(track.album).toBe(mockLibraryState.albums[track.albumId])
        }
      })
    })
  })

  describe('getTracksFromAlbum', () => {
    it('should return an album tracks, hydrated', () => {
      const tracks: Track[] = getTracksFromAlbum('1', mockLibraryState)

      expect(tracks).toBeArray()
      expect(tracks.length).toBe(2)

      const retrievedTracksIds = tracks.map((item) => item.id)
      const expectedTracksIds = Object.values<Track>(mockLibraryState.tracks)
        .filter((item) => item.albumId === '1')
        .map((item) => item.id)

      expect(retrievedTracksIds).toStrictEqual(expectedTracksIds)

      tracks.forEach((track) => {
        if (track.artistId) {
          expect(track.artist).toBe(mockLibraryState.artists[track.artistId])
        }
        if (track.albumId) {
          expect(track.album).toBe(mockLibraryState.albums[track.albumId])
        }
      })
    })
  })

  describe('getTracksFromPlaylist', () => {
    it('should handle playlists with no tracks', () => {
      const playlistsStateTest: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          playlist_01: {
            id: 'playlist_01',
            title: 'My playlist',
            date: '2020-04-14',
            items: [],
          },
        },
      }

      const tracks = getTracksFromPlaylist(
        'playlist_01',
        libraryInitialState,
        playlistsStateTest
      )

      expect(tracks).toBeArray()
      expect(tracks).toBeEmpty()
    })

    it('should return a playlist tracks, hydrated', () => {
      const playlistsStateTest: PlaylistsStateType = {
        ...playlistsInitialState,
        playlists: {
          playlist_01: {
            id: 'playlist_01',
            title: 'My playlist',
            date: '2020-04-14',
            items: [
              {
                track: {
                  id: '1',
                  title: 'Track 1',
                  number: 1,
                  disc: '',
                  duration: 123,
                  cover: '',
                  albumId: '1',
                  artistId: '1',
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
          },
        },
      }

      const tracks: Track[] = getTracksFromPlaylist(
        'playlist_01',
        mockLibraryState,
        playlistsStateTest
      )

      expect(tracks).toBeArray()
      expect(tracks.length).toBe(2)
      tracks.forEach((track) => {
        if (track.artistId) {
          expect(track.artist).toBe(mockLibraryState.artists[track.artistId])
        }
        if (track.albumId) {
          expect(track.album).toBe(mockLibraryState.albums[track.albumId])
        }
      })
    })
  })
})
