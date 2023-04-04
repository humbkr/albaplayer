import configureMockStore from 'redux-mock-store'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import libraryAPI from 'modules/library/api'
import librarySlice, {
  fetchLibrary,
  initLibrary,
  libraryInitialState,
  LibraryStateType,
  setLastScan,
} from '../store'

jest.mock('modules/library/api', () => ({
  libraryAPI: {
    getLibrary: jest.fn().mockResolvedValue({}),
  },
}))

const mockStore = configureMockStore([thunk])
const makeMockStore = (customState: any = {}) =>
  mockStore({
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
      src: '/stream/1',
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
      src: '/stream/2',
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
      src: '/stream/3',
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
      src: '/stream/4',
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
      src: '/stream/5',
      number: 1,
      disc: '',
      duration: 164,
      cover: '',
      albumId: '4',
      artistId: '1',
    },
  },
}

describe('library (redux)', () => {
  describe('reducers', () => {
    it('should handle librarySlice initial state', () => {
      // @ts-ignore
      expect(librarySlice(undefined, {})).toEqual(libraryInitialState)
    })

    it('should handle setLastScan action', () => {
      const mockState: LibraryStateType = { ...libraryInitialState }

      expect(
        librarySlice(mockState, {
          type: setLastScan.type,
          payload: '20200417143543',
        })
      ).toEqual({
        ...mockState,
        lastScan: '20200417143543',
      })
    })
  })

  describe('extra reducers', () => {
    describe('fetchLibrary', () => {
      it('updates state correctly for the pending action', () => {
        const mockState: LibraryStateType = { ...libraryInitialState }

        expect(
          librarySlice(mockState, {
            type: fetchLibrary.pending.type,
            payload: null,
          })
        ).toEqual({
          ...mockState,
          isFetching: true,
        })
      })

      it('updates state correctly for the fulfilled action', () => {
        const mockState: LibraryStateType = { ...libraryInitialState }

        const expectedAlbums: { [id: string]: Album } = {}
        Object.values(mockLibraryState.albums).forEach((item) => {
          expectedAlbums[item.id] = item
        })

        expect(
          librarySlice(mockState, {
            type: fetchLibrary.fulfilled.type,
            payload: {
              artists: Object.values(mockLibraryState.artists),
              albums: Object.values(mockLibraryState.albums),
              tracks: Object.values(mockLibraryState.tracks),
            },
          })
        ).toEqual({
          ...mockState,
          isFetching: false,
          isInitialized: true,
          artists: mockLibraryState.artists,
          albums: expectedAlbums,
          tracks: mockLibraryState.tracks,
        })
      })

      it('updates state correctly for the rejected action', () => {
        const mockState: LibraryStateType = {
          ...libraryInitialState,
          isFetching: true,
          isInitialized: true,
        }

        expect(
          librarySlice(mockState, {
            type: fetchLibrary.rejected.type,
            payload: null,
          })
        ).toEqual({
          ...mockState,
          isFetching: false,
          isInitialized: false,
          initHasFailed: true,
        })
      })
    })
  })

  describe('initLibrary thunk', () => {
    it('should bypass shouldFetchLibrary() when force parameter is set', async () => {
      libraryAPI.getLibrary = jest
        .fn()
        .mockReturnValueOnce(new Promise((resolve) => resolve({ data: {} })))

      const store = makeMockStore({
        library: {
          ...libraryInitialState,
          isFetching: true,
        },
      })

      // @ts-ignore
      await store.dispatch(initLibrary(true))

      const actual = store.getActions()

      expect(actual[0].type).toEqual(initLibrary.pending.type)
      expect(actual[1].type).toEqual(fetchLibrary.pending.type)
      expect(actual[2].type).toEqual(fetchLibrary.fulfilled.type)
      expect(actual[3].type).toEqual(initLibrary.fulfilled.type)
    })

    it('should do nothing when shouldFetchLibrary() returns false and force is not set', async () => {
      const store = makeMockStore({
        library: {
          ...libraryInitialState,
          isFetching: true,
        },
      })

      // @ts-ignore
      await store.dispatch(initLibrary())

      const actual = store.getActions()

      // Check that fetch thunk is not called.
      expect(actual.length).toBe(2)
      expect(actual[0].type).toEqual(initLibrary.pending.type)
      expect(actual[1].type).toEqual(initLibrary.fulfilled.type)
    })
  })

  describe('fetchLibrary thunk', () => {
    it('should dispatch correct actions when api call is successful', async () => {
      libraryAPI.getLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolve(response)
          })
      )

      const store = makeMockStore()

      const response = {
        data: {
          artists: Object.values(mockLibraryState.artists),
          albums: Object.values(mockLibraryState.albums),
          tracks: Object.values(mockLibraryState.tracks),
          variable: {
            value: '20200417145741',
          },
        },
      }

      // @ts-ignore
      await store.dispatch(fetchLibrary())

      const actual = store.getActions()

      expect(actual.length).toBe(3)
      expect(actual[0].type).toEqual(fetchLibrary.pending.type)
      expect(actual[1].type).toEqual(setLastScan.type)
      expect(actual[2].type).toEqual(fetchLibrary.fulfilled.type)
    })

    it('should dispatch correct actions when api call is unsuccessful', async () => {
      libraryAPI.getLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            reject()
          })
      )

      const store = makeMockStore()

      // @ts-ignore
      await store.dispatch(fetchLibrary())

      const actual = store.getActions()

      expect(actual.length).toBe(2)
      expect(actual[0].type).toEqual(fetchLibrary.pending.type)
      expect(actual[1].type).toEqual(fetchLibrary.rejected.type)
    })
  })
})
